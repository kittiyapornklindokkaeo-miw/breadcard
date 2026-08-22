import { useState } from "react"
import toast from "react-hot-toast"
import { data } from "react-router"

export const useEdit = (editFn, { onSuccess, validate, openModal, closeModal, initialForm = {} } = {}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [error, setError] = useState({})
    const [selectIdEdit, setSelectIdEdit] = useState(null)
    const [formEdit, setFormEdit] = useState(initialForm)

    const handleEdit = async(e) => {
        e.preventDefault()
        // if(!selectIdEdit) return
        setError({})

        if(validate) {
            const validateError = validate(formEdit)
            if(validateError && Object.keys(validateError).length > 0) {
                setError(validateError)
                return
            }
        }

        setIsEditing(true)
        try {
            const res = selectIdEdit != null
                ? await editFn(selectIdEdit, formEdit)
                : await editFn(formEdit)
            onSuccess?.()
            toast.success(res.data.message, { duration: 2000 })
        } catch (err) {
            console.log(err)
            const message = err?.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
            setError({ general: message })
            toast.error(message)
        } finally {
            setIsEditing(false)
        }
    }

    const onChangeEdit = (e) => {
        const { name, value } = e.target
        setFormEdit(prev => ({ ...prev, [name]: value }))
    }

    const openModalEdit = (data) => {
        setSelectIdEdit(data.id)
        setFormEdit(data)
        openModal()
    }

    const closeModalEdit = () => {
        closeModal()
        setSelectIdEdit(null)
        setFormEdit(initialForm)
    }

    return { isEditing, error, formEdit, setFormEdit, openModalEdit, closeModalEdit, handleEdit, onChangeEdit }
}