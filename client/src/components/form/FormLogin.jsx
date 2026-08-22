import { useState } from "react"
import Logo from "../../assets/logo.svg"
import Input from "../ui/Input"
import Button from "../ui/Button"
import { Link } from "react-router"
import { IoEye, IoEyeOff } from "react-icons/io5"
import Google from "../../assets/google.png"
import Facebook from "../../assets/facebook.png"

const FormLogin = ({ onSubmit, onSignUp, form, onChange, error, google, facebook }) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="sm:w-80 grid gap-5 font-itim text-secondary">
            <div className="grid justify-items-center gap-3">
                <img src={Logo} className="w-20 lg:w-30" />
                <div className="text-center">
                    <h1 className="font-bold text-2xl">เข้าสู่ระบบ</h1>
                    <p className="font-light">ยินดีต้อนรับการกลับมาของคุณ</p>
                </div>
            </div>
            <form onSubmit={onSubmit} className="grid gap-3">
                <div className="grid gap-5">
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
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                        <input
                            name="rememberMe"
                            checked={form.rememberMe}
                            onChange={onChange}
                            type="checkbox" className="accent-secondary" />
                        <span className="text-xs">จดจำฉัน</span>
                    </div>
                    <Link to="/recover_password">
                        <p className="text-xs text-accent hover:text-red-600 hover:underline decoration-accent cursor-pointer">ลืมรหัสผ่าน ?</p>
                    </Link>
                </div>
                <Button
                    type="submit"
                    children="เข้าสู่ระบบ"
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
            <p className="font-light text-stone-400 text-xs text-center">คุณไม่มีบัญชีใช่ไหม ? มา<span onClick={onSignUp} className="text-accent hover:text-red-600 hover:underline decoration-accent cursor-pointer">สร้างบัญชีใหม่</span>กันเถอะ</p>
        </div>
    )
}
export default FormLogin