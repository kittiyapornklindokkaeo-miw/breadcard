const { db } = require("../config/database")

const DeckModel = {
    findIdAndUserId: async(id, userId) => {
        const [row] = await db.query('SELECT id, userId FROM decks WHERE id = ? AND userId = ?', [id, userId])

        return row[0] || null
    },
    findAllByUserId: async(userId, limit) => {
        let sql = `
            SELECT 
                d.id, 
                d.deck_name, 
                d.max_point, 
                d.createdAt, 
                c.category_name, 
                c.id AS category_id,
				COUNT(v.id) AS total_vocab,
                EXISTS (
                    SELECT 1 
                    FROM favorites AS f
                    WHERE f.deck_id = d.id AND f.userId = ?
                ) AS isFavorite
            FROM decks AS d 
            LEFT JOIN categories AS c ON c.id = d.category_id
            LEFT JOIN vocabularies AS v ON v.deck_id = d.id
            WHERE d.userId = ?
            GROUP BY d.id
            `

        const [rows] = await db.query(sql, [userId, userId])
        return rows.map(row => ({ ...row, isFavorite: Boolean(row.isFavorite) })) 
    },
    countDeck: async(userId) => {
        const [row] = await db.query('SELECT COUNT(id) AS total FROM decks WHERE userId = ?', [userId])

        return row[0]?.total || 0
    }
}
module.exports = DeckModel