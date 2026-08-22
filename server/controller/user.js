const { db } = require("../config/database")
const UserModel = require("../models/userModel")

exports.update = async(req, res, next) =>  {
    try {
        const { name, url, public_id } = req.body
        const userId = req.session.userId

        if(!userId) {
            return res.status(400).json({ message: 'ไม่พบข้อมูลผู้ใช้' })
        }

        const user = await UserModel.findById(userId)
        if(!user) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ใช้หรือคุณไม่มีสิทธิ์แก้ไขข้อมูลผู้ใช้นี้'})
        }

        await db.query('UPDATE users SET name = ?, url = ?, public_id = ? WHERE id = ?', [name, url, public_id, userId])

        res.status(200).json({ message: 'แก้ไขข้อมูลผู้ใช้สำเร็จ' })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.remove = async(req, res, next) => {
      console.log(req.session.userId)
    try {
        const userId = req.session.userId
        console.log(userId)

        if (!userId) {
            return res.status(401).json({ message: 'กรุณาเข้าสู่ระบบ' })
        }

        const user = await UserModel.findById(userId)
        if(!user) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ใช้'})
        }

        await db.query('DELETE FROM users WHERE id = ?', [userId])

        req.session.destroy((err) => {
            if (err) {
                console.error(err)
                return next(err)
            }
            res.clearCookie('connect.sid')
            res.status(200).json({ message: 'ลบบัญชีผู้ใช้สำเร็จ' })
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}