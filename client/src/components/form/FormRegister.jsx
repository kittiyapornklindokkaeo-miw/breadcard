import { useState } from "react"
import Logo from "../../assets/logo.svg"
import Input from "../ui/Input"
import Button from "../ui/Button"
import { IoEye, IoEyeOff } from "react-icons/io5"
import Google from "../../assets/google.png"
import Facebook from "../../assets/facebook.png"

const FormRegister = ({ onSubmit, form, onChange, error, google, facebook }) => {
    const [showPassword, setShowPassword] = useState(false)
    return (
        <div className="sm:w-80 grid gap-5 font-itim text-secondary">
            <div className="grid justify-items-center gap-3">
                <img src={Logo} className="w-20 lg:w-30" />
                <div className="text-center">
                    <h1 className="font-bold text-2xl">ยินดีต้อนรับ</h1>
                    <p className="font-light">มาสร้างบัญชีของคุณกัน!</p>
                </div>
            </div>
            <form onSubmit={onSubmit} className="grid gap-3">
                <div className="grid gap-5">
                    <Input
                        type="text"
                        value={form.name}
                        name="name"
                        title="ชื่อผู้ใช้"
                        style="w-full"
                        onChange={onChange}
                        error={error.name}
                    />
                    <Input
                        type="email"
                        value={form.email}
                        name="email"
                        title="อีเมลล์"
                        style="w-full"
                        onChange={onChange}
                        error={error.email}
                    />
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        name="password"
                        title="รหัสผ่าน"
                        style="w-full"
                        onChange={onChange}
                        error={error.password}
                        suffix={
                            <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <IoEye /> : <IoEyeOff />}
                            </button>
                        }
                    />
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={form.confirmPassword}
                        name="confirmPassword"
                        title="ยืนยันรหัสผ่าน"
                        style="w-full"
                        onChange={onChange}
                        error={error.confirmPassword}
                        suffix={
                            <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <IoEye /> : <IoEyeOff />}
                            </button>
                        }
                    />
                </div>
                <Button
                    type="submit"
                    children="สร้างบัญชี"
                    variant="secondary"
                    width="w-full"
                />
            </form>
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-full h-px bg-stone-200" />
                    <span className="font-light text-sm text-stone-300">หรือ</span>
                    <div className="w-full h-px bg-stone-300" />
                </div>
                <div className="flex w-full gap-3">
                    <div onClick={google} className="w-full py-1 shadow shadow-stone-200 rounded-md flex justify-center items-center gap-2 hover:bg-stone-50">
                        <img src={Google} className="w-7" />

                    </div>
                    <div onClick={facebook} className="w-full py-1 shadow shadow-stone-200 rounded-md flex justify-center items-center gap-2 hover:bg-stone-50">
                        <img src={Facebook} className="w-7" />

                    </div>
                </div>
            </div>
            <div className="text-xs text-center text-stone-400 space-y-2">
                <p>ถ้าคุณกดลงทะเบียนแสดงว่าคุณยอมรับข้อกำหนดในการให้บริการและนโยบายความเป็นส่วนตัวกับ Breadcard แล้ว</p>
                <p>คุณมีบัญชีอยู่แล้ว ? ไป<span className="text-accent">ลงชื่อเข้าใช้</span></p>
            </div>

        </div>
    )
}
export default FormRegister