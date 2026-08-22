import { useState } from "react"
import { create, remove } from "../api/image";

export const useUploadImage = (form, setForm, type) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)

    const handleOnChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return
    
        const sizeInMb = file.size / 1024 / 1024
        if (sizeInMb > 1.5) {
            setError('รูปภาพยังใหญ่เกินไป กรุณาเลือกรูปใหม่')
            e.target.value = ''
            return
        }
    
        setIsLoading(true)
        try {
            if (form?.public_id) {
                await remove(form.public_id)
            }
    
            const formData = new FormData()
            formData.append('image', file)
            formData.append('type', type)
    
            const res = await create(formData)
            setForm({
                ...form,
                url: res.data.url,
                public_id: res.data.public_id
            })
        } catch (error) {
            console.log(error)
            setError('อัปโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่')
        } finally {
            setIsLoading(false)
            e.target.value = ''
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        try {
            if (!form?.public_id) return
            await remove(form.public_id)
            setForm({ ...form, url: '', public_id: '' })
        } catch (error) {
            console.log(error)
        }
    }

    return { isLoading, error, handleDelete, handleOnChange }
}