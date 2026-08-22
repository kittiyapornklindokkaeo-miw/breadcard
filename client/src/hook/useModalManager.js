import { useState } from "react";

export const useModalManager = () => {
    //จัดการสถานะของ modal ว่าปิดหรือเปิด
    const [currentModal, setCurrentModal] = useState(null)

    //รับชื่อ modal ที่ต้องการเปิด
    const openModal = (modalName) => setCurrentModal(modalName)
    //ปิด modal
    const closeModal = () => setCurrentModal(null)


    //ฟังก์ชันตรวจสอบว่า modalName ที่เข้ามาเปิดหรือปิดอยู่
    const toggleModal = (modalName) => {
        if(currentModal === modalName) {
            closeModal()
        } else {
            openModal(modalName)
        }
    }

    return { openModal, closeModal, toggleModal, currentModal }
}