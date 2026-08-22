const { db } = require("../config/database")
const bcrypt = require('bcrypt')
const UserModel = require("../models/userModel")
const crypto = require('crypto')
const { sendResetEmail } = require("../lib/sendEmail")

exports.register = async(req, res, next) => {
    try {
        const { email, name, password } = req.body

        if(!email || !name || !password){ return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ'}) }

        //เช็คอีเมลล์ที่เข้ามา
        const existingUser = await UserModel.findByEmail(email)
        if(existingUser) {
            return res.status(400).json({ message: 'อีเมลล์นี้ลงทะเบียนแล้ว'})
        }

        //hash password and insert data
        const hashPassword = await bcrypt.hash(password, 10)
        await UserModel.create({ email, name, password_hash: hashPassword })

        res.status(201).json({ message: 'ลงทะเบียนสำเร็จ' })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.login = async(req, res, next) => {
    try {
        const { email, password, rememberMe } = req.body

         // Check if both email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
        }

        // check email
        const user = await UserModel.findByEmail(email) 
        if(!user) {
            return res.status(400).json({ message: 'อีเมลล์หรือรหัสผ่านไม่ถูกต้อง'})
        }

        // bcrypt.compare คืนค่า true/false
        const isPasswordValid  = await bcrypt.compare(password, user.password_hash)
        if(!isPasswordValid) {
            return res.status(400).json({ message: 'อีเมลล์หรือรหัสผ่านไม่ถูกต้อง'})
        }

        // if login successful, store the user's ID in the session
        req.session.userId = user.id

        // if 'remember' is true, extend the session expiration time to 2 days
        if(rememberMe) {
            req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 2 // 2 days
        } else {
            req.session.cookie.expires = false // เมื่อปิด browser แล้วล้าง session
        }

        // Send a success response with the user data
        res.status(202).json({
            error: false,
            message: 'เข้าสู่ระบบสำเร็จ'
        });
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.logout = async(req, res, next) => {
    try {
        req.session.destroy((err) => {
            if(err) {
                return res.status(500).json({ message: 'ออกจากระบบไม่สำเร็จ' })
            }
            res.clearCookie('connect.sid')//ลบ cookie ออกจากบราวเซอร์
            res.status(200).json({ message: 'ออกจากระบบสำเร็จ' })
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.getMe = async(req, res, next) => {
    try {
        const userId = req.session.userId

         if(!userId) {
            return res.status(401).json({ message: 'กรุณาเข้าสู่ระบบ'})
         }

         const user = await UserModel.findById(userId)

         res.json({ id: user.id, name: user.name, email: user.email, url: user.url, public_id: user.public_id, provider: user.provider, createdAt: user.created_at })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.forgotPassword = async(req, res, next) => {
    try {
        const { email } = req.body

        const user = await UserModel.findByEmail(email)
        if(!user) {
            return res.status(404).json({ message: 'ไม่พบอีเมลล์ผู้ใช้นี้' })
        }

        const token = crypto.randomBytes(32).toString('hex')
        const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 ชั่วโมง

        await db.query('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?', [token, expires, user.id])

        await sendResetEmail(user.email, token, user.name)
        res.status(200).json({ message: 'กรุณาตรวจสอบอีเมลล์ของคุณเพื่อเปลี่ยนรหัสผ่าน'})
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'ส่งอีเมลล์ไม่สำเร็จ' })
    }
}

exports.resetPassword = async(req, res, next) => {
    try {
        const { token, newPassword } = req.body

        // หา user จาก token + เช็คว่ายังไม่หมดอายุ
        const [row] = await db.query('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()', [ token ])

        if(!row[0]) {
            return res.status(400).json({ message: 'ลิงก์สำหรับรีเซ็ตรหัสผ่านหมดอายุ กรุณาส่งอีเมลล์ใหม่อีกครั้ง' })
        }

        const user = row[0]
        const hashPassword = await bcrypt.hash(newPassword, 10)

        // บันทึกรหัสผ่านใหม่และลบ token ทื้ง
        await db.query('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?', [hashPassword , user.id])

        res.status(200).json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ กรุณาล็อกอินใหม่อีกครั้ง'})
    } catch (error) {
        console.error(error)
        next(error)
    }
}
