import { useEffect, useRef, useState } from "react"
import { FaXmark } from "react-icons/fa6";
import { useClickOutside } from "../../hook/useClickOutside";

const Modal = ({ onClose, children, modalRef, closeOnOutsideClick = true }) => {
    useClickOutside(modalRef, onClose, closeOnOutsideClick)

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
            <div ref={modalRef} className="bg-white w-auto h-auto rounded-lg p-5">
                {children}
            </div>
        </div>
    )
}
export default Modal