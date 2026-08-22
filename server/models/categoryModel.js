const { db } = require("../config/database")

const CategoryModel = {
    findIdAndUserId: async(id, userId) => {
        const [row] = await db.query('SELECT id, userId, public_id FROM categories WHERE id = ? AND userId = ?', [id, userId])

        return row[0] || null
    },
    findAllByUserId: async(userId) => {   
        let sql = `
            SELECT 
                c.id, 
                c.category_name, 
                c.url,
                c.public_id, 
                c.createdAt, 
                c.updatedAt, 
                COALESCE(dk.total_decks, 0) AS total_decks,
                COALESCE(dk.decks, JSON_ARRAY()) AS decks
            FROM breadcard.categories AS c
            LEFT JOIN (
                SELECT 
                    d.category_id,
                    COUNT(d.id) AS total_decks,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', d.id,
                            'deck_name', d.deck_name,
                            'max_point', d.max_point,
                            'createdAt', d.createdAt,
                            'total_vocab', v.total_vocab,
                            'isFavorite', EXISTS (
                                SELECT 1 
                                FROM breadcard.favorites AS f
                                WHERE f.deck_id = d.id AND f.userId = ?
                            )
                        )
                    ) AS decks
                FROM breadcard.decks AS d
                LEFT JOIN (
                    SELECT deck_id, COUNT(id) AS total_vocab
                    FROM breadcard.vocabularies
                    GROUP BY deck_id
                ) AS v ON v.deck_id = d.id
                GROUP BY d.category_id
            ) AS dk ON dk.category_id = c.id
            WHERE c.userId = ?
            `

        const [rows] = await db.query(sql, [userId, userId])
        const categories = rows.map(category => ({     
            ...category,
            decks: category.decks.map(deck => ({
                ...deck,
                category_name: category.category_name,
                category_id: category.id,
                isFavorite: Boolean(deck.isFavorite),
            }))
        }))

        return categories
    },
    countCategory: async(userId) => {
        const [row] = await db.query('SELECT COUNT(id) AS total FROM categories WHERE userId = ?', [userId])

        return row[0]?.total || 0
    }
}
module.exports = CategoryModel