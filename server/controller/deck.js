const { db } = require("../config/database")
const CategoryModel = require("../models/categoryModel")
const DeckModel = require("../models/deckModel")
const { getScore, resetScore } = require('../lib/pronunciationScoreStore')

exports.create = async(req, res, next) => {
    try {
        const { deck_name, category_id } = req.body
        const userId = req.session.userId

        if(!deck_name) {
            return res.status(400).json({ message: 'กรุณากรอกชื่อชุดคำศัพท์'})
        }

        let categoryId = null
        if(category_id) {
            categoryId = parseInt(category_id)
            if (isNaN(categoryId)) {
                return res.status(400).json({ message: 'หมวดหมู่ไม่ถูกต้อง' })
            }

            const category = await CategoryModel.findIdAndUserId(categoryId, userId)
            if(!category) {
                return res.status(404).json({ message: 'คุณไม่มีสิทธิ์เพิ่มชุดคำศัพท์ในหมวดหมู่นี้'})
            }
        }

        await db.query('INSERT INTO decks (deck_name, category_id, userId) VALUES (?, ?, ?)', [ deck_name, categoryId, userId ])

        res.status(201).json({ message: 'สร้างชุดคำศัพท์สำเร็จ' })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.list = async(req, res, next) => {
    try {
        const userId = req.session.userId

        const result = await DeckModel.findAllByUserId(userId)

        res.status(200).json({ data: result })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.update = async(req, res, next) => {
    try {
        const { deck_name, category_id } = req.body
        const id = parseInt(req.params.id)
        const userId = req.session.userId

        if (isNaN(id)) {
            return res.status(400).json({ message: 'ข้อมูลไม่ถูกต้อง' })
        }

        if(!deck_name) {
            return res.status(400).json({ message: 'กรุณากรอกชื่อชุดคำศัพท์'})
        }

        let categoryId = null
        if(category_id) {
            categoryId = parseInt(category_id)
            if (isNaN(categoryId)) {
                return res.status(400).json({ message: 'หมวดหมู่ไม่ถูกต้อง' })
            }
        }

        const deck = await DeckModel.findIdAndUserId(id, userId)
        if(!deck) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลชุดคำศัพท์นี้หรือคุณไม่มีสิทธิ์แก้ไขชุดคำศัพท์นี้'})
        }

        await db.query('UPDATE decks SET deck_name = ?, category_id = ? WHERE id = ?', [ deck_name, categoryId, id ])

        res.status(200).json({ message: 'แก้ไขข้อมูลชุดคำศัพท์สำเร็จ' })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.remove = async(req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const userId = req.session.userId

        if (isNaN(id)) {
            return res.status(400).json({ message: 'ข้อมูลไม่ถูกต้อง' })
        }

        const deck = await DeckModel.findIdAndUserId(id, userId) 
        if(!deck) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลชุดคำศัพท์นี้หรือคุณไม่มีสิทธิ์ลบชุดคำศัพท์นี้'})
        }

        await db.query('DELETE FROM decks WHERE id = ?', [id])

        res.status(200).json({ message: 'ลบชุดคำศัพท์สำเร็จ'})
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.save = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const userId = req.session.userId

        if (isNaN(id)) {
            return res.status(400).json({ message: 'ข้อมูลไม่ถูกต้อง' })
        }

        const deck = await DeckModel.findIdAndUserId(id, userId)
        if (!deck) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลชุดคำศัพท์นี้หรือคุณไม่มีสิทธิ์แก้ไขชุดคำศัพท์นี้' })
        }

        // อ่านคะแนนที่ backend สะสมไว้เอง — ไม่สนใจว่า client ส่งอะไรมาใน body เลย
        const finalScore = getScore(userId, id)

        if (finalScore <= 0) {
            return res.status(400).json({ message: 'ยังไม่มีข้อมูลการเล่นสำหรับชุดคำศัพท์นี้' })
        }

        await db.query(
            'UPDATE decks SET max_point = GREATEST(COALESCE(max_point, 0), ?) WHERE id = ?',
            [finalScore, id]
        )

        resetScore(userId, id) // จบรอบแล้ว เคลียร์ตัวนับทิ้ง กันรอบถัดไปบวกทับของเก่า

        res.status(200).json({ message: 'สำเร็จ', score: finalScore })
    } catch (error) {
        console.error(error)
        next(error)
    }
}