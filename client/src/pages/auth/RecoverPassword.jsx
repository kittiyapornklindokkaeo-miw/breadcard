import { useState } from "react"
import toast from "react-hot-toast"
import Button from "../../components/ui/Button"
import { validateEmail } from "../../validation/validator"
import { forgotPassword } from "../../api/auth"
import { IoMdCheckmarkCircleOutline } from "react-icons/io";


const RecoverPassword = () => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleRrecoverPassword = async (e) => {
        e.preventDefault()
        const err = validateEmail(email)
        if (err) {
            setError(err)
            return
        }
        setError('')

        try {
            console.log(email)
            const res = await forgotPassword(email)
            toast.success(res.data.message)
            setSuccess('ส่งแล้ว')
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message || 'เกิดข้อผิดพลาด')
        }
    }

    return (
        <div className="bg-neutral w-full h-screen flex items-center justify-center">
            <form onSubmit={handleRrecoverPassword} className="bg-white w-sm p-7 rounded-2xl font-google text-secondary text-center space-y-7">
                <div className="text-center space-y-2">
                    <p className="text-5xl">🤔</p>
                    <h1 className="font-bold text-2xl">คุณลืมรหัสผ่าน ?</h1>
                </div>
                <p className="text-sm">เราสามารถส่งคำแนะนำในการรีเซ็ทรหัสผ่านไปยังบัญชีที่คุณใช้ลงทะเบียนกับเรา</p>
                <div className="grid justify-items-start">
                    <label htmlFor="email" className='mb-1 font-medium text-sm'>
                        อีเมลล์
                    </label>
                    <input
                        type="email"
                        value={email}
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ex. flashcard@bread.card"
                        className="w-full text-sm px-3 py-2 border border-secondary-content rounded-md bg-white focus:outline-secondary"
                    />
                    {error && (<p className="text-xs text-accent mt-1">{error}</p>)}
                </div>
                <div>
                    {success && (
                        <div className="flex justify-center items-center gap-2 mb-1 text-sm text-stone-400">
                            <IoMdCheckmarkCircleOutline />
                            <p>ส่งแล้ว</p>
                        </div>
                    )}
                    <Button
                        children="ส่งอีเมลล์"
                        type="submit"
                        variant="secondary"
                        width="w-full"
                    />
                </div>
                <p className="text-xs text-stone-400">อย่าลืมตรวจสอบโฟลเดอร์สแปมของคุณ หรือปลดบล็อก breadcard7@gmail.com หากคุณไม่พบข้อความ</p>
            </form>
        </div>
    )
}
export default RecoverPassword