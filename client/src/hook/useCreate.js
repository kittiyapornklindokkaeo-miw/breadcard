import { useState } from "react";
import toast from "react-hot-toast";

export const useCreate = (createFn, { onSuccess, validate, closeModal, initialForm = {} } = {}) => {
    const [form, setForm] = useState(initialForm)
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState({})

    const handleSubmit = async(e) => {
        e?.preventDefault()      
        //เช็คความถูกต้องของฟอร์มที่ส่งเข้ามา
        if(validate) {
            const validateError = validate(form)
            if(validateError && Object.keys(validateError).length > 0) {
                setError(validateError)
                return
            }
        }

        setIsCreating(true)

        try {
            const res = await createFn(form)
            //ใส่ ? กันไว้เผื่อไม่ได้มีการส่งฟังก์ชันนี้เข้ามา
            onSuccess?.()
            toast.success(res.data.message, { duration: 2000 })
        } catch (err) {
            console.log(err)
            const message = err?.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
            setError({ general: message })
            toast.error(message)
        } finally {
            setIsCreating(false)
        }

    }

    const onChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value}))
    }

       const closeModalCreate = () => {
        closeModal()
        setForm(initialForm)
    }

    return { error, isCreating, form, setForm, onChange, handleSubmit, closeModalCreate}
}