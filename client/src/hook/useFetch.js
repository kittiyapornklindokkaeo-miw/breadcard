import { useCallback, useState } from "react"

export const useFetch = (listFn) => {
    const [ data, setData ] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleGetData = useCallback(async(params) => {
        setIsLoading(true)
        setError('')

        try {
            const res = await listFn(params)
            setData(res.data.data)
        } catch (err) {
            console.log(err)
            const message = err?.response?.data.message || 'โหลดข้อมูลไม่สำเร็จ'
            setError(message)
        } finally {
            setIsLoading(false)
        }
    }, [listFn])

    return { data, setData, isLoading, error, handleGetData }
}