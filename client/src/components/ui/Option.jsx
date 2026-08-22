import { useEffect, useRef, useState } from "react"
import { GoKebabHorizontal, GoTrash } from "react-icons/go";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";

const Option = ({ onDelete, onEdit, style }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const trigger = useRef(null);
    const dropdown = useRef(null);

    //ปิด dropdown เมื่อคลิกนอกเมนู
    useEffect(() => {
        const clickHandle = ({ target }) => {
            if (!dropdown.current) return;
            if (
                !dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)
            ) return;

            setDropdownOpen(false)
        }

        document.addEventListener('click', clickHandle)
        return () => document.removeEventListener('click', clickHandle)
    }, [dropdownOpen])

    return (
        <div className="relative">
            <button
                ref={trigger}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="group flex justify-center items-center w-6 h-6 rounded-full hover:bg-secondary/10"
            >
                <GoKebabHorizontal className={`group-hover:text-secondary size-4 rotate-90 ${style ? style : 'text-stone-400'}`} />
            </button>
            {
                dropdownOpen && (
                    <div
                        ref={dropdown}
                        className="absolute w-30 h-auto top-0 right-0 p-2 flex flex-col bg-white border border-secondary-content rounded-lg shadow-xs">
                        <button type="button" onClick={onEdit} className="flex items-center gap-3 text-start rounded-lg p-1 hover:bg-stone-100"><FiEdit2 />แก้ไข</button>
                        <button type="button" onClick={onDelete} className="flex items-center gap-3 text-start text-red-600 rounded-lg p-1 hover:bg-stone-100"><AiOutlineDelete />ลบ</button>
                    </div>
                )
            }

        </div>
    )
}
export default Option