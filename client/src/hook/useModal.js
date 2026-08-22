import { useState, useRef } from "react";
import { useClickOutside } from "./useClickOutside";

export const useModal = () => {
    const [ isOpen, setIsOpen ] = useState(false)
    const modalRef = useRef(null)

    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)

    // //ถ้าผู้ใช้มีการคลิกนอก modal ก็จะเรียกใช้ฟังก์ชันนี้
    // useClickOutside(modalRef, () => {
    //     if(isOpen) {
    //         closeModal()
    //     }
    // })

    return { isOpen, openModal, closeModal }
}