import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import Button from "../../components/ui/Button"
import { useState } from "react"
import InputWithLabel from "../../components/ui/InputWithLabel"
import { resetPassword } from "../../api/auth"
import toast from "react-hot-toast"
import { useNavigate, useSearchParams } from "react-router"
import { validatePassword } from "../../validation/validator"
import { IoEye, IoEyeOff } from "react-icons/io5";


const ResetPassword = () => {
    const [form, setForm] = useState({
        newPassword: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        confirmPassword: false
    })
    const [error, setError] = useState({})
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') // ดึง token จาก ?token=xxxx

    console.log(token)

    const handleRrecoverPassword = async (e) => {
        e.preventDefault()
        const err = validatePassword(form.newPassword)
        if (err) {
            setError({ newPassword: err })
            return
        }


        if (form.confirmPassword !== form.newPassword) {
            setError({ confirmPassword: 'รหัสผ่านไม่ตรงกัน' })
            return
        }

        setError({})

        try {
            const res = await resetPassword({ token, newPassword: form.newPassword })
            toast.success(res.data.message)
            navigate('/')
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message || 'เกิดข้อผิดพลาด')
        }
    }

    const handleOnchange = (e) => {
        const { name, value } = e.target

        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const toggleShowPassword = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }))
    }
    return (
        <div className="bg-neutral w-full h-screen flex items-center justify-center">
            <form onSubmit={handleRrecoverPassword} className="bg-white w-sm p-7 rounded-2xl font-google text-secondary text-center space-y-7">
                <div className="text-center space-y-2">
                    <p className="text-5xl">🗝️</p>
                    <h1 className="font-bold text-2xl">เปลี่ยนรหัสผ่าน</h1>
                </div>
                <p className="text-sm">เลือกรหัสผ่านใหม่ให้บัญชของคุณ</p>
                <div className="space-y-3">
                    <InputWithLabel
                        title="รหัสผ่านใหม่"
                        type={showPassword.newPassword ? "text" : "password"}
                        value={form.newPassword}
                        name="newPassword"
                        onChange={handleOnchange}
                        placeholder="กรอกรหัสผ่านใหม่"
                        error={error.newPassword}
                        suffix={
                            <button type="button" onClick={() => toggleShowPassword('newPassword')}>
                                {showPassword.newPassword ? <IoEyeOff /> : <IoEye />}
                            </button>
                        }
                    />
                    <InputWithLabel
                        title="ยืนยันรหัสผ่าน"
                        type={showPassword.confirmPassword ? "text" : "password"}
                        value={form.confirmPassword}
                        name="confirmPassword"
                        onChange={handleOnchange}
                        placeholder="กรอกยืนยันรหัสผ่าน"
                        error={error.confirmPassword}
                        suffix={
                            <button type="button" onClick={() => toggleShowPassword('confirmPassword')}>
                                {showPassword.confirmPassword ? <IoEyeOff /> : <IoEye />}
                            </button>
                        }
                    />
                </div>
                <Button
                    children="เปลี่ยนรหัสผ่าน"
                    type="submit"
                    variant="secondary"
                    width="w-full"
                />
            </form>
        </div>
    )
}
export default ResetPassword