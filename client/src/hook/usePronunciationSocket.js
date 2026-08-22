import { useRef, useState, useCallback } from "react"

export function usePronunciationSocket({ onNextWord } = {}) {
    const socketRef = useRef(null)
    const [result, setResult] = useState(null)
    const [point, setPoint] = useState(0)
    const [flip, setFlip] = useState(false)
    const [status, setStatus] = useState("เริ่มต้น") // idle | connecting | open | ready | error | closed
    const [error, setError] = useState(null)
    //เก็บ onNextWord ตัวล่าสุดไว้ใน Ref อัปเดตทุกเรนเดอร์
    const onNextWordRef = useRef(onNextWord)
    onNextWordRef.current = onNextWord

    const connect = useCallback((vocabularyId) => {
        return new Promise((resolve, reject) => {
            setStatus("เชื่อมต่อสำเร็จ")
            setError(null)
            const ws = new WebSocket(import.meta.env.VITE_PRONUNCIATION_WS_URL)
            socketRef.current = ws

            ws.onopen = () => {
                setStatus("เตรียมตัว")
                ws.send(JSON.stringify({ type: "start", vocabularyId }))
            }

            ws.onmessage = (event) => {
                // console.log('[ws] message:', event.data)
                let data
                try {
                    data = JSON.parse(event.data)
                } catch {
                    return
                }

                if (data.type === "ready") {
                    setStatus("เริ่มพูด")
                    resolve(ws)
                    return
                }

                if (data.type === "result") {
                    setResult(data.result)
                    setPoint(data.sessionTotal)
                    setFlip(true)

                    setTimeout(() => {
                        setFlip(false)
                        setResult(null)
                        onNextWordRef.current?.()
                    }, 2000)
                    return
                }

                if (data.error) {
                    setStatus("เกิดข้อผิดพลาด")
                    setError(data.error)
                    return
                }
            }

            ws.onerror = () => {
                setStatus("เกิดข้อผิดพลาด")
                reject(new Error("websocket_error"))
            }

            ws.onclose = (event) => {
                console.log('[ws] closed. code:', event.code, 'reason:', event.reason)
                setStatus("ปิด")
                // ถ้ายังไม่เคย resolve/reject มาก่อน (เช่น server ปิดก่อนได้ ready) ให้ reject ด้วย
                reject(new Error(`connection_closed_unexpectedly: code ${event.code}`))
            }
        })
    }, [])

    const sendChunk = useCallback((chunk) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(chunk)
        }
    }, [])

    const sendStop = useCallback(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: "stop" }))
        }
    }, [])

    const disconnect = useCallback(() => {
        socketRef.current?.close()
    }, [])

    const resetPoint = useCallback(() => {
        setPoint(0)
    }, [])

    return { connect, sendChunk, sendStop, disconnect, resetPoint, result, status, error, point, flip }
}
             