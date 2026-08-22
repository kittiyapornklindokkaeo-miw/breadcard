import Logo from "../../assets/logo_not_name_black.svg"
import { BiHome } from "react-icons/bi";
import { NavLink, useNavigate } from "react-router"
import { BiCategoryAlt, BiSolidCategoryAlt } from "react-icons/bi";
import { GoHome, GoHomeFill, GoHeartFill, GoHeart, GoFileDirectoryFill, GoFileDirectory, GoSignOut, GoPersonFill, GoPerson } from "react-icons/go";
import { BsBookFill, BsBook } from "react-icons/bs";
import SidebarLink from "./SidebarLink";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useModalManager } from "../../hook/useModalManager";
import Modal from "../modal/Modal";
import FormProfile from "../form/FormProfile";
import { useRef } from "react";


const SideBar = () => {
    const navigate = useNavigate();
    const modalRef = useRef(null)
    const { handleLogout } = useAuth();
    const { openModal, closeModal, currentModal } = useModalManager()

    return (
        <div className="w-72 h-screen p-5 border-r border-secondary-content">
            <div className="flex flex-col w-full h-full">
                <div className="flex flex-col flex-1 space-y-3">
                    <div className="pl-4">
                        <img src={Logo} width={50} />
                    </div>
                    <div>
                        <SidebarLink to="/user" end IconOutLine={GoHeart} IconFill={GoHeartFill} label="ชื่นชอบ" />
                        <SidebarLink to="/user/category" end IconOutLine={GoFileDirectory} IconFill={GoFileDirectoryFill} label="หมวดหมู่" />
                        <SidebarLink to="/user/deck" end IconOutLine={BsBook} IconFill={BsBookFill} label="ชุดคำศัพท์" />
                        <button onClick={() => openModal('profileModal')} type="button" className="w-full flex gap-5 items-center p-4 font-itim text-xl text-secondary  hover:bg-stone-100 rounded-full transition duration-300 ease-in-out" ><GoPerson className="size-7" /> โปรไฟล์</button>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleLogout}
                    className={`flex gap-5 items-center w-full p-4 rounded-full font-itim  md:text-xl text-secondary hover:bg-stone-100`}
                >
                    <GoSignOut className="size-6" />
                    <span>ออกจากระบบ</span>
                </button>
            </div>
            {
                currentModal === 'profileModal' && (
                    <Modal modalRef={modalRef} onClose={closeModal}>
                        <FormProfile />
                    </Modal>
                )
            }
        </div>
    )
}
export default SideBar