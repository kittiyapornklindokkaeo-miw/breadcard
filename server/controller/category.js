const { db } = require("../config/database")
const CategoryModel = require("../models/categoryModel")
const DeckModel = require("../models/deckModel")
const cloudinary = require('../config/cloudinary')

exports.create = async(req, res, next) => {
    try {
        const { category_name, url, public_id } = req.body
        const userId = req.session.userId

        if(!category_name) {
            return res.status(400).json({ message: 'กรุณากรอกชื่อหมวดหมู่'})
        }

        await db.query('INSERT INTO categories (category_name, url, public_id, userId) VALUES (?, ?, ?, ?)', [ category_name, url, public_id, userId ])

        res.status(201).json({ message: 'สร้างหมวดหมู่สำเร็จ' })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.list = async(req, res, next) => {
    try {
        const userId = req.session.userId

        const result = await CategoryModel.findAllByUserId(userId)

        res.status(200).json({ data: result })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.update = async(req, res, next) => {
    try {
        const { category_name, url, public_id } = req.body
        const id = parseInt(req.params.id)
        const userId = req.session.userId

        if (isNaN(id)) {
            return res.status(400).json({ message: 'ข้อมูลไม่ถูกต้อง' })
        }

        if(!category_name) {
            return res.status(400).json({ message: 'กรุณากรอกชื่อหมวดหมู่'})
        }

        const category = await CategoryModel.findIdAndUserId(id, userId)
        if(!category.length === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลหมวดหมู่นี้หรือคุณไม่มีสิทธิ์แก้ไขหมวดหมู่นี้'})
        }

        await db.query('UPDATE categories SET category_name = ?, url = ?, public_id = ? WHERE id = ?', 
            [ category_name, url, public_id, id ]
        )

        res.status(200).json({ message: 'แก้ไขข้อมูลหมวดหมู่สำเร็จ' })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.remove = async(req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const userId = req.session.userId

        if(isNaN(id)) {
            return res.status(400).json({message: 'ข้อมูลไม่ถูกต้อง'})
        }

        const category = await CategoryModel.findIdAndUserId(id, userId)
        if(!category) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลหมวดหมู่นี้หรือคุณไม่มีสิทธิ์ลบหมวดหมู่นี้'})
        }

        if(category.public_id) {
            await cloudinary.uploader.destroy(category.public_id)
        }

        await db.query('DELETE FROM categories WHERE id = ?', [id])

        res.status(200).json({ message: 'ลบหมวดหมู่สำเร็จ'})
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.removeDeck = async(req, res, next) => {
    try {
        const categoryId = parseInt(req.params.id)
        const { deckId } = req.body
        const userId = req.session.userId
        console.log(deckId)

        if(isNaN(categoryId)) {
            return res.status(400).json({ message: 'ข้อมูลไม่ถูกต้อง' })
        }

        if (!Array.isArray(deckId) || deckId.length === 0) {
            return res.status(400).json({ message: 'กรุณาเลือกชุดคำศัพท์ที่ต้องการลบ' })
        }

        for (const id of deckId) {
            const deck = await DeckModel.findIdAndUserId(id, userId)
            if(!deck) {
                return res.status(404).json({ message: 'ไม่พบข้อมูลชุดคำศัพท์นี้หรือคุณไม่มีสิทธิ์ลบชุดคำศัพท์นี้'})
            }
        }

        await db.query('UPDATE decks SET category_id = null WHERE id IN (?) AND userId = ? AND category_id = ?', [deckId, userId, categoryId])

        res.status(200).json({ message: 'ลบชุดคำศัพท์ออกจากหมวดหมู่นี้สำเร็จ' })
    } catch (error) {
        console.error(error)
        next(error)
    }
}