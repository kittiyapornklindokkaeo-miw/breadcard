import { useRef, useState } from "react";
import { GoSortAsc, GoSortDesc, GoChevronDown, GoChevronUp } from "react-icons/go";
import { useClickOutside } from "../../hook/useClickOutside";

const SortData = ({ onSort, onDirection, column, sortConfig }) => {
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef(null)
    useClickOutside(dropdownRef, () => setOpen(false))
    return (
        <div className="flex gap-3 font-itim">
            <div className="flex items-center gap-3">
                <p>เรียงจาก</p>
                <button
                    onClick={onDirection}
                    className="bg-white p-1 rounded-md border border-secondary-content text-stone-500 hover:shadow-xs"
                >
                    {sortConfig.direction === 'ASC' ? <GoSortAsc size={20} /> : <GoSortDesc size={20} />}
                </button>
            </div>
            <div className="relative flex items-center gap-3">
                <p>เรียงโดย</p>
                <button onClick={() => setOpen(!open)} className="bg-white p-1 rounded-md border border-secondary-content text-stone-500 hover:shadow-xs">
                    <GoChevronDown className={`size-5 transition-transform duration-500 ease-in-out ${open ? 'rotate-180' : ''}`} />
                </button>
                {
                    open && (
                        <div ref={dropdownRef} className="absolute top-10 right-0 lg:w-40 h-auto bg-white border border-secondary-content rounded-md shadow-md p-2">
                            <ul className="">
                                {
                                    column?.map((i, idx) => (
                                        <li key={idx}>
                                            <button type="button" onClick={() => onSort(i.key)} className={`w-full py-1 px-2 text-start rounded-md text-stone-500 hover:text-yellow-600 hover:bg-yellow-300/25 ${sortConfig.key === i.key ? 'bg-yellow-200 text-yellow-600' : ''}`}>{i.title}</button>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
export default SortData