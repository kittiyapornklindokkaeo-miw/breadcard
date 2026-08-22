import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { RiUser5Fill } from "react-icons/ri";

const Navbar = () => {
    const { user } = useAuth();
    const [msg, setMsg] = useState('');

    useEffect(() => {
        messageBar()
    }, [user])

    const messageBar = () => {
        const currentHour = new Date().getHours(); // คืนค่า 0-23

        if (currentHour >= 5 && currentHour < 12) {
            setMsg(`สวัสดีตอนเช้า`)
        } else if (currentHour >= 12 && currentHour < 16) {
            setMsg(`สวัสดีตอนบ่าย`)
        } else {
            setMsg(`สวัสดีตอนเย็น`)
        }
    }

    return (
        <nav className="flex justify-between items-center w-full p-5 border-b border-secondary-content">
            <div className="font-itim font-bold md:text-xl text-secondary">{msg} {user?.name ?? ''} 👋</div>
            <div className="flex justify-end gap-1">
                <div className="bg-secondary w-7 h-7 rounded-full overflow-clip flex  items-center justify-center">
                    {user?.url ? <img src={user.url} /> : <RiUser5Fill className="size-5 fill-neutral" />}
                </div>
                <span className="font-itim font-mediums truncate md:text-lg text-secondary">{user?.name}</span>
            </div>
        </nav>
    )
}
export default Navbar