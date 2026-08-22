const { db } = require("../config/database")

const VocabularyModel = {
    findIdAndUserId: async(id, userId) => {
        const [row] = await db.query(`
            SELECT v.id, d.userId, v.public_id 
            FROM vocabularies AS v
            JOIN decks AS d ON v.deck_id = d.id
            WHERE v.id = ? AND d.userId = ?
            `, [id, userId])

        return row[0] || null
    },
    findForPronunciation: async(id, userId) => {
        const [row] = await db.query(`
            SELECT v.id, v.word, v.pinyin, v.deck_id, d.userId
            FROM vocabularies AS v
            JOIN decks AS d ON v.deck_id = d.id
            WHERE v.id = ? AND d.userId = ? 
            `, [id, userId])
        return row[0] || null
    },
    findAllByDeck: async(deckId) => {
        const [rows] = await db.query('SELECT id, word, pinyin, meaning, url, public_id FROM vocabularies WHERE deck_id = ? ORDER BY id DESC', [deckId])

        return rows
    },
    countVocabulary: async(userId) => {
        const [row] = await db.query(`
            SELECT COUNT(v.id) AS total 
            FROM vocabularies AS v
            LEFT JOIN decks AS d ON v.deck_id = d.id
            WHERE d.userId = ?`, [userId])

        return row[0]?.total || 0
    }
}

module.exports = VocabularyModel