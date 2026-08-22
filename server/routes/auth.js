const express = require('express')
const { register, login, forgotPassword, resetPassword, getMe, logout } = require('../controller/auth')
const router = express.Router()
const rateLimit = require('express-rate-limit')


// จำกัดการล็อกอินไม่เกิน 10 ครั้ง ต่อ 15 นาที
const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'ลองใหม่อีกครั้งใน 15 นาที'
})

router.post('/register', register)
router.post('/login', loginLimit, login)
router.post('/logout', logout)
router.get('/me', getMe)
router.post('/forgot-password', forgotPassword)
router.patch('/reset-password', resetPassword)



module.exports = router