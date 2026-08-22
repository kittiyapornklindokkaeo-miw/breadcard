const passwordPattern = /^(?=.*?[0-9])(?=.*?[A-Za-z]).{6,}$/
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const validateEmail = (email) => {
    if(!email || email.trim() === "") {
        return "กรุณากรอกอีเมลล์"
    } else if(!emailPattern.test(email)) {
        return "รูปแบบอีเมลล์ไม่ถูกต้อง"
    }
}

export const validatePassword = (password) => {
    if(!password || password.trim() === "") {
        return "กรุณากรอกรหัสผ่าน"
    } else if(!passwordPattern.test(password)) {
       return "รหัสผ่านต้องมีมากกว่า 6 ตัวและมีตัวอักษรหรือตัวเลข"
    }
}