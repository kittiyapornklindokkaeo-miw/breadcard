const { Resend } = require('resend')
const { resetPasswordTemplate } = require('../utils/emailTemplates')
const resend = new Resend(process.env.RESEND_API_KEY)

exports.sendResetEmail = async(email, token, name) => {
    try {
        const resetUrl = `${process.env.CLIENT_URL}/reset_password?token=${token}`

        await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'คำขอรีเซ็ตรหัสผ่าน',
            html: resetPasswordTemplate(name, resetUrl)
        })
    } catch (error) {
        console.error(error)
        throw error // throw error ขึ้นไปให้ forgot password จัดการ
    }
}