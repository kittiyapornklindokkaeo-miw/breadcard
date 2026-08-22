const store = new Map() // key: `${userId}:${deckId}` -> { score, updatedAt }

const TTL_MS = 30 * 60 * 1000 // เก็บไว้ 30 นาที ถ้าไม่มีการเล่นต่อ ถือว่าทิ้ง session

function makeKey(userId, deckId) {
    return `${userId}:${deckId}`
}

function getScore(userId, deckId) {
    const entry = store.get(makeKey(userId, deckId))
    if (!entry) return 0
    if (Date.now() - entry.updatedAt > TTL_MS) {
        store.delete(makeKey(userId, deckId))
        return 0
    }
    return entry.score
}

function addScore(userId, deckId, points) {
    const key = makeKey(userId, deckId)
    const current = getScore(userId, deckId) // ผ่าน getScore เพื่อเช็ค TTL ไปในตัว
    store.set(key, { score: current + points, updatedAt: Date.now() })
    return current + points
}

function resetScore(userId, deckId) {
    store.delete(makeKey(userId, deckId))
}

// sweep เป็นระยะกัน memory ค้างจาก session ที่เล่นค้างไว้ไม่จบ
setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
        if (now - entry.updatedAt > TTL_MS) store.delete(key)
    }
}, 5 * 60 * 1000)

module.exports = { getScore, addScore, resetScore }