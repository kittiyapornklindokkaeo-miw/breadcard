import { NavLink } from "react-router"

const SidebarLink = ({ to, end, IconOutLine, IconFill, label }) => {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                `flex gap-5 items-center p-4 font-itim text-xl text-secondary  hover:bg-stone-100 rounded-full transition duration-300 ease-in-out
                            ${isActive ? 'font-bold' : ''}`
            }
        >
            {({ isActive }) => (
                <>
                    {isActive ? <IconFill className="size-7 fill-accent" /> : <IconOutLine className="size-7" />}
                    <span>{label}</span>
                </>
            )}
        </NavLink>
    )
}
export default SidebarLink