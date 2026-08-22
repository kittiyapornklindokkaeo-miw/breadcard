import { Outlet } from "react-router"
import Navbar from "../components/header/Navbar"
import SideBar from "../components/sidebar/SideBar"

const LayoutUser = () => {
    return (
        <div className="flex">
            <SideBar />
            <div className="w-full h-screen flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 p-5 overflow-y-auto bg-neutral">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
export default LayoutUser