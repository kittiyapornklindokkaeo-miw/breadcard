import { useMemo, useState } from "react"

export const useSearch = (data, key ) => {
    const [textSearch, setTextSearch] = useState('')

    const filteredData = useMemo(() => {
        if(!textSearch.trim()) return data
        return data?.filter((item) => 
        item[key]?.toLowerCase().includes(textSearch.toLowerCase()) )
    }, [data, textSearch, key])

    return { filteredData, textSearch, setTextSearch }
}