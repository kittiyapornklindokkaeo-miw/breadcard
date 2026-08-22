const { WebSocket, WebSocketServer } = require('ws')
const { buildIflytekWsUrl } = require('../lib/iflytekSign')
const { parseIseResult } = require('../utils/parseIseResult')
const sessionMiddleware = require('../config/session')
const UserModel = require('../models/userModel')
const VocabularyModel = require('../models/vocabularyModel')
const { getScore, addScore } = require('../lib/pronunciationScoreStore')

const FRAME = {
    FIRST: 'first',
    CONTINUE: 'continue',
    LAST: 'last',
}

// ==== ปรับค่าพวกนี้ได้ตามความเหมาะสม ====
const HANDSHAKE_TIMEOUT_MS = 10_000      // ต้องส่ง "start" ภายใน 10 วิ หลังเชื่อม
const IFLYTEK_OPEN_TIMEOUT_MS = 8_000    // เปิด connection ไป iFlytek ต้องสำเร็จภายใน 8 วิ
const IDLE_AUDIO_TIMEOUT_MS = 15_000     // ไม่มี audio chunk เข้ามานาน 15 วิ ระหว่างพูด = ตัดทิ้ง
const MAX_CONCURRENT_PER_USER = 2        // 1 user เปิดพร้อมกันได้สูงสุดกี่ connection
// ==========================================

// เก็บ connection ที่ active อยู่ต่อ user (กัน spam เปิดหลาย tab/retry ถี่ๆ)
const activeConnectionsByUser = new Map() // userId -> Set<clientSocket>

function trackConnection(userId, clientSocket) {
    if (!activeConnectionsByUser.has(userId)) {
        activeConnectionsByUser.set(userId, new Set())
    }
    activeConnectionsByUser.get(userId).add(clientSocket)
}

function untrackConnection(userId, clientSocket) {
    const set = activeConnectionsByUser.get(userId)
    if (!set) return
    set.delete(clientSocket)
    if (set.size === 0) activeConnectionsByUser.delete(userId)
}

function countActiveConnections(userId) {
    return activeConnectionsByUser.get(userId)?.size || 0
}

exports.setUpPronuncationRelay = (server) => {
    console.log('[wsRelay] ✅ relay initialized')
    const wss = new WebSocketServer({ noServer: true })

    server.on("upgrade", (req, socket, head) => {
        if (!req.url.startsWith("/ws/pronuncation")) return

        try {
            sessionMiddleware(req, {}, async (err) => {
                if (err) {
                    console.error('[ws upgrade] session middleware error:', err)
                    socket.destroy()
                    return
                }

                const resolvedUserId = req.session.userId || req.session.passport?.user

                if (!resolvedUserId) {
                    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n")
                    socket.destroy()
                    return
                }

                let user
                try {
                    user = await UserModel.findById(resolvedUserId)
                } catch (dbErr) {
                    console.error('[ws upgrade] failed to load user:', dbErr)
                    socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n")
                    socket.destroy()
                    return
                }

                if (!user) {
                    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n")
                    socket.destroy()
                    return
                }

                // จำกัด concurrent connection ต่อ user ก่อนยอมรับ connection ใหม่
                if (countActiveConnections(user.id) >= MAX_CONCURRENT_PER_USER) {
                    socket.write("HTTP/1.1 429 Too Many Requests\r\n\r\n")
                    socket.destroy()
                    return
                }

                req.user = user

                wss.handleUpgrade(req, socket, head, (ws) => {
                    wss.emit("connection", ws, req)
                })
            })
        } catch (err) {
            console.error('[ws upgrade] sync error:', err)
            socket.destroy()
        }
    })

    wss.on("connection", (clientSocket, req) => {
        const userId = req.user.id
        trackConnection(userId, clientSocket)

        let iflytekSocket = null
        let frameStatus = FRAME.FIRST
        let started = false
        let closed = false

        let handshakeTimer = null
        let iflytekOpenTimer = null
        let idleAudioTimer = null

        const safeSend = (payload) => {
            if (clientSocket.readyState === WebSocket.OPEN) {
                clientSocket.send(JSON.stringify(payload))
            }
        }

        const clearAllTimers = () => {
            clearTimeout(handshakeTimer)
            clearTimeout(iflytekOpenTimer)
            clearTimeout(idleAudioTimer)
        }

        const cleanup = (reason) => {
            if (closed) return
            closed = true
            clearAllTimers()
            untrackConnection(userId, clientSocket)
            if (iflytekSocket && iflytekSocket.readyState === WebSocket.OPEN) {
                iflytekSocket.close()
            }
            if (reason) console.log(`[pronunciation] session closed: ${reason} (user ${userId})`)
        }

        const resetIdleTimer = () => {
            clearTimeout(idleAudioTimer)
            idleAudioTimer = setTimeout(() => {
                safeSend({ error: "idle_timeout", detail: "ไม่มีการส่งเสียงเข้ามานานเกินไป" })
                clientSocket.close(4008, "Idle timeout")
                cleanup("idle timeout")
            }, IDLE_AUDIO_TIMEOUT_MS)
        }

        // ต้องส่ง "start" ภายในเวลาที่กำหนด ไม่งั้นปิดทิ้ง กัน connection เปิดค้างเปล่าๆ
        handshakeTimer = setTimeout(() => {
            if (!started) {
                safeSend({ error: "handshake_timeout", detail: "ไม่ได้ส่งรหัสคำศัพท์ภายในเวลาที่กำหนด" })
                clientSocket.close(4003, "Handshake timeout")
                cleanup("handshake timeout")
            }
        }, HANDSHAKE_TIMEOUT_MS)

        clientSocket.on("message", async (data, isBinary) => {
            if (closed) return

            if (!started) {
                if (isBinary) {
                    safeSend({ error: "ต้องส่งรหัสคำศัพท์เข้ามาก่อน" })
                    clientSocket.close(4002, "ไม่พบรหัสคำศัพท์")
                    cleanup("audio sent before start")
                    return
                }

                let payload
                try {
                    payload = JSON.parse(data.toString())
                } catch {
                    safeSend({ error: "ข้อมูลไม่ถูกต้อง" })
                    return
                }

                if (payload.type !== "start" || !payload.vocabularyId) {
                    safeSend({ error: "ไม่พบรหัสคำศัพท์" })
                    return
                }

                let vocab
                try {
                    vocab = await VocabularyModel.findForPronunciation(payload.vocabularyId, userId)
                } catch (dbErr) {
                    console.error('[pronunciation] vocabulary lookup failed:', dbErr)
                    safeSend({ error: "internal_error" })
                    clientSocket.close(1011, "Internal error")
                    cleanup("vocabulary lookup failed")
                    return
                }

                if (!vocab) {
                    safeSend({ error: "ไม่เจอคำศัพท์" })
                    clientSocket.close(4004, "ไม่เจอคำศัพท์")
                    cleanup("vocabulary not found")
                    return
                }

                clearTimeout(handshakeTimer) // ผ่าน handshake แล้ว ไม่ต้องกลัว timeout นี้อีก

                iflytekSocket = new WebSocket(buildIflytekWsUrl())

                // ถ้าเปิด connection ไป iFlytek ไม่สำเร็จภายในเวลาที่กำหนด แจ้ง error แทนที่จะค้างเงียบๆ
                iflytekOpenTimer = setTimeout(() => {
                    if (iflytekSocket && iflytekSocket.readyState !== WebSocket.OPEN) {
                        safeSend({ error: "iflytek_connection_timeout" })
                        clientSocket.close(1011, "Upstream timeout")
                        iflytekSocket.terminate()
                        cleanup("iflytek connection timeout")
                    }
                }, IFLYTEK_OPEN_TIMEOUT_MS)

                iflytekSocket.on("open", () => {
                    clearTimeout(iflytekOpenTimer)
                    console.log(`[pronunciation] user ${userId} started word "${vocab.word}"`)
                    started = true

                    iflytekSocket.send(JSON.stringify({
                        common: { app_id: process.env.PRONUNCATION_APP_ID },
                        business: {
                            sub: "ise",
                            ent: "cn_vip",
                            category: "read_word",
                            text: `\uFEFF${vocab.word}`,
                            tte: "utf-8",
                            rstcd: "utf8",
                            ttp_skip: true,
                            cmd: "ssb",
                            aue: "raw",
                            auf: "audio/L16;rate=16000",
                        },
                        data: { status: 0 },
                    }))

                    frameStatus = FRAME.CONTINUE
                    safeSend({ type: "ready" })
                    resetIdleTimer() // เริ่มนับเวลาว่าต้องมี audio chunk เข้ามาไม่งั้น timeout
                })

                iflytekSocket.on("message", (msg) => {
                    let response
                    try {
                        response = JSON.parse(msg.toString())
                    } catch {
                        clientSocket.send(msg.toString())
                        return
                    }

                    if (response.code !== 0) {
                        safeSend({
                            error: "iflytek_business_error",
                            code: response.code,
                            detail: response.message,
                        })
                        return
                    }

                    if (response.data?.status !== 2) {
                        return
                    }

                    clearTimeout(idleAudioTimer) // ได้ผลลัพธ์สุดท้ายแล้ว ไม่ต้องกลัว idle timeout อีก

                    try {
                        const result = parseIseResult(response.data.data)
                        const sessionTotal = addScore(userId, vocab.deck_id, result.overall.totalScore)
                        safeSend({ type: "result", result, sessionTotal })
                    } catch (err) {
                        console.error("[pronunciation] failed to parse ISE XML:", err)
                        safeSend({ error: "parse_result_failed" })
                    }
                })

                iflytekSocket.on("error", (err) => {
                    clearAllTimers()
                    safeSend({ error: "iflytek_connection_failed", detail: err.message })
                })

                iflytekSocket.on("close", () => {
                    clientSocket.close()
                    cleanup("iflytek closed")
                })

                return
            }

            // หลัง started แล้ว: text = control ("stop"), binary = audio chunk
            if (!isBinary) {
                let payload
                try {
                    payload = JSON.parse(data.toString())
                } catch {
                    return
                }

                if (payload.type === "stop" && iflytekSocket?.readyState === WebSocket.OPEN) {
                    clearTimeout(idleAudioTimer)
                    iflytekSocket.send(JSON.stringify({
                        common: { app_id: process.env.PRONUNCATION_APP_ID },
                        business: { aus: 4, cmd: "auw", aue: "raw" },
                        data: { status: 2, data: "" },
                    }))
                }
                return
            }

            // audio chunk (binary)
            if (iflytekSocket?.readyState !== WebSocket.OPEN) return

            resetIdleTimer() // มี audio chunk เข้ามา = ยังไม่ idle รีเซ็ตนาฬิกา

            const isFirstAudioChunk = frameStatus === FRAME.CONTINUE
            iflytekSocket.send(JSON.stringify({
                common: { app_id: process.env.PRONUNCATION_APP_ID },
                business: { aus: isFirstAudioChunk ? 1 : 2, cmd: "auw", aue: "raw" },
                data: { status: 1, data: data.toString('base64') },
            }))

            if (isFirstAudioChunk) frameStatus = FRAME.LAST
        })

        clientSocket.on("close", () => {
            cleanup("client closed")
        })

        clientSocket.on("error", (err) => {
            console.error('[pronunciation] client socket error:', err.message)
            cleanup("client socket error")
        })
    })
}