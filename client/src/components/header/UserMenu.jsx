import { IoIosArrowDown } from "react-icons/io"
import { RiUser5Fill } from "react-icons/ri"
import Button from "../ui/Button"
import { useState } from "react"
import { Link } from 'react-router'
import { BsBook } from "react-icons/bs"

const UserMenu = ({ user, logOut }) => {
    const [dropdown, setDropdown] = useState(false)
    return (
        <div className="flex items-center gap-2">
            <div className="bg-accent w-7 h-7 rounded-full overflow-clip flex  items-center justify-center">
                {user?.url ? <img src={user.url} /> : <RiUser5Fill className="size-5 fill-neutral" />}
            </div>
            <div>
                <span>{user?.name}</span>
            </div>
            <div className="relative z-10">
                <IoIosArrowDown
                    onClick={() => setDropdown(!dropdown)}
                    className={`text-stone-400 focus:text-accent transition duration-300 ${dropdown ? 'rotate-180' : 'rotate-0'}`} />
                <div className={`absolute top-7 right-0 min-w-max bg-white rounded-md p-3 border border-stone-100 shadow-sm text-sm transition-all duration-200 ease-in-out
    ${dropdown
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2 pointer-events-none"
                    }`}>
                    <div className="flex flex-col gap-3">
                        <span className="text-xs text-stone-400">เกี่ยวกับฉัน</span>
                        <Link to='/user'>
                            <button type="button" className="p-2 rounded-lg flex gap-2 items-center hover:bg-stone-50">
                                <BsBook size={20} /> แฟลชการ์ดของฉัน
                            </button>
                        </Link>
                        <Button
                            onClick={logOut}
                            type="button"
                            children="ลงชื่อออก"
                            variant="secondary"
                            width="w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UserMenu