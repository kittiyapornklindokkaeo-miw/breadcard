import { data } from "react-router"
import { validateEmail, validatePassword } from "./validator"

export const loginValidate = (data) => {
    const errors = {}
   
    const emailError = validateEmail(data.email)
    if(emailError) errors.email = emailError

    const passwordError = validatePassword(data.password)
    if(passwordError) errors.password = passwordError

    return errors
}

export const registerValidate = (data) => {
    const errors = {}

    if(!data.name || data.name.trim() === "") {
        errors.name = "กรุณากรอกชื่อผู้ใช้"
    }

    const emailError = validateEmail(data.email)
    if(emailError) errors.email = emailError

    const passwordError = validatePassword(data.password)
    if(passwordError) errors.password = passwordError

    if(data.password !== data.confirmPassword) {
        errors.confirmPassword = "รหัสผ่านไม่ตรงกัน"   
    } else if(!data.name || data.name.trim() === "") {
        errors.confirmPassword = "กรุณายืนยันรหัสผ่าน"
    }
    return errors
}
