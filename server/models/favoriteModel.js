const { db } = require("../config/database")

const FavoriteModel = {
    findDeckIdAndUserId: async(deckId, userId) => {
        const [row] = await db.query('SELECT id, deck_id, userId FROM favorites WHERE deck_id = ? AND userId = ?', [deckId, userId])

        return row[0] || null
    },
    findAllByUserId: async(userId) => {
        const [rows] = await db.query(`
            SELECT 
                d.id, 
                d.deck_name, 
                d.max_point, 
                d.updatedAt, 
                c.category_name, 
                c.id AS category_id,
                COUNT(v.id) AS total_vocab,
                EXISTS (
                    SELECT 1 
                    FROM favorites AS f
                    WHERE f.deck_id = d.id AND f.userId = ?
                ) AS isFavorite
            FROM favorites AS f
            LEFT JOIN decks AS d ON f.deck_id = d.id
            LEFT JOIN categories AS c ON c.id = d.category_id
            LEFT JOIN vocabularies AS v ON v.deck_id = d.id
            WHERE d.userId = ?
            GROUP BY d.id
            `, [userId, userId])

        return rows.map(row => ({ ...row, isFavorite: Boolean(row.isFavorite) }))
    }
}
module.exports = FavoriteModel