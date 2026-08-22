const { db } = require("../config/database")
const DeckModel = require("../models/deckModel")
const VocabularyModel = require("../models/vocabularyModel")
const cloudinary = require('../config/cloudinary')

exports.create = async(req, res, next) => {
    try {
        const { word, pinyin, meaning, url, public_id, deck_id } = req.body
        const userId = req.session.userId

        let deckId = null
        if(deck_id) {
            deckId = parseInt(deck_id)
            if (isNaN(deckId)) {
                return res.status(400).json({ message: 'หมวดหมู่ไม่ถูกต้อง' })
            }

            const deck = await DeckModel.findIdAndUserId(deckId, userId)
            if(!deck) {
                return res.status(404).json({ messsage: 'ไม่พบชุดคำศัพท์นี้หรือคุณไม่มีสิทธิ์เพิ่มคำศัพท์ในชุดคำศัพท์นี้' })
            }
        }

        if(!word) {
            return res.status(400).json({ message: 'กรุณากรอกคำศัพท์'})
        }

        await db.query('INSERT INTO vocabularies (word, pinyin, meaning, url, public_id, deck_id) VALUES (?, ?, ?, ?, ?, ?)', [word, pinyin, meaning, url, public_id, deckId])

        res.status(201).json({ message: 'สร้างคำศัพท์สำเร็จ' })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.list = async(req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const userId = req.session.userId

        if (isNaN(id)) {
            return res.status(400).json({ message: 'ข้อมูลไม่ถูกต้อง' })
        }

        const deck = await DeckModel.findIdAndUserId(id, userId)
        if(!deck) {
            return res.status(404).json({ message: 'ไม่พบคำศัพท์ของชุดคำศัพท์นี้หรือคุณไม่มีสิทธิ์ดูข้อมูลชุดคำศัพท์นี้' })
        }

        const result = await VocabularyModel.findAllByDeck(id)

        res.status(200).json({ data: result })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.update = async(req, res, next) => {
    try {
        const { word, pinyin, meaning, url, public_id } = req.body
        const id = parseInt(req.params.id)
        const userId = req.session.userId

        if (isNaN(id)) {
            return res.status(400).json({ message: 'ข้อมูลไม่ถูกต้อง' })
        }

        if(!word) {
            return res.status(400).json({ message: 'กรุณากรอกชื่อคำศัพท์'})
        }

        const vocabulary = await VocabularyModel.findIdAndUserId(id, userId)
        if(!vocabulary) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลคำศัพท์นี้หรือคุณไม่มีสิทธิ์แก้ไขคำศัพท์นี้'})
        }

        await db.query('UPDATE vocabularies SET word = ?, pinyin = ?, meaning = ?, url = ?, public_id = ? WHERE id = ?', 
            [  word, pinyin, meaning, url, public_id, id ]
        )

        res.status(200).json({ message: 'แก้ไขข้อมูลคำศัพท์สำเร็จ' })
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

        const vocabulary = await VocabularyModel.findIdAndUserId(id, userId)
        if(!vocabulary) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลคำศัพท์นี้หรือคุณไม่มีสิทธิ์ลบคำศัพท์นี้'})
        }

        if(vocabulary.public_id) {
            await cloudinary.uploader.destroy(vocabulary.public_id)
        }

        await db.query('DELETE FROM vocabularies WHERE id = ?', [id])

        res.status(200).json({ message: 'ลบคำศัพท์สำเร็จ'})
    } catch (error) {
        console.error(error)
        next(error)
    }
}
