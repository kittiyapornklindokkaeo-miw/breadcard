import { useState } from "react";
import toast from "react-hot-toast";

export const useRemove = (removeFn, { onSuccess, openModal, closeModal } = {}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [selectId, setSelectId] = useState(null)

    const handleRemove = async() => {
        try {
            setIsLoading(true)

            const res = selectId != null
                ? await removeFn(selectId)
                : await removeFn()
            onSuccess?.()
            toast.success(res.data.message, { duration: 2000 })

        } catch (err) {
            console.log(err)
            const message = err?.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    const openModalRemove = (id) => {
        openModal()
        setSelectId(id)
    }

    const closeModalRemove = () => {
        closeModal()
        setSelectId(null)
    }

    return {  selectId, setSelectId, isLoading, handleRemove, openModalRemove, closeModalRemove }
}