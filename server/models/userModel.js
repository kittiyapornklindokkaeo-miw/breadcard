const { db } = require("../config/database")

// สร้างเป็น obj เก็บฟังก์ชันที่ใช่บ่อยไว้
const UserModel = {
    findByEmail: async (email) => {
        const [row] = await db.query('SELECT * FROM users WHERE email = ?', [email]
        )

        return row[0] || null
    },

    findById: async (id) => {
        const [row] = await db.query(`
            SELECT u.*, o.provider
            FROM users AS u
            LEFT JOIN oauth_accounts AS o ON u.id = o.user_id
            WHERE u.id = ?
            `, [id]
        )

        return row[0] || null
    },

    create: async (userData) => {
        const [rows] = await db.query('INSERT INTO users SET ?', userData
        )

        return rows
    }
}

module.exports = UserModel