const { db } = require("../config/database")
const FavoriteModel = require("../models/favoriteModel")

exports.create = async(req, res, next) => {
    try {
        const { deck_id } = req.body
        const userId = req.session.userId

        const parsedDeckId = parseInt(deck_id)
        if (!deck_id || isNaN(parsedDeckId)) {
            return res.status(400).json({ message: 'ข้อมูลไม่ถูกต้อง' })
        }
        
        const favExist = await FavoriteModel.findDeckIdAndUserId(parsedDeckId, userId)
        if(favExist) {
            await db.query('DELETE FROM favorites WHERE deck_id = ? AND userId = ?',[parsedDeckId, userId] )
            return res.status(200).json({ message: 'ยกเลิกรายการชื่นชอบสำเร็จ' })
        } else {
            await db.query('INSERT INTO favorites (deck_id, userId) VALUES (?, ?)', [ parsedDeckId, userId ])
            return res.status(201).json({ message: 'เพิ่มรายการชื่นชอบสำเร็จ' })
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.list = async(req, res, next) => {
    try {
        const userId = req.session.userId

        const result = await FavoriteModel.findAllByUserId(userId, userId)

        res.status(200).json({ data: result })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

