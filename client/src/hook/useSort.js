import { useMemo, useState } from "react"

export const useSort = (data) => {
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ASC' })

    const handleOnSort = (keyname) => {
        setSortConfig(prev => ({ ...prev, key: keyname}))
    }

    const handleSetDirection = () => {
        setSortConfig(prev => ({ ...prev, direction: prev.direction === 'ASC' ? 'DESC' : 'ASC' }));
    }

    const sortedData = useMemo(() => {
        if(!sortConfig.key || !data) return data

        return [...data].sort((a, b) => {
            const valueA = a[sortConfig.key]
            const valueB = b[sortConfig.key]

            let compare
            if(typeof(valueA) === 'string') {
                compare = valueA.localeCompare(valueB)
            } else {
                compare = (valueA ?? 0) - (valueB ?? 0)
            }
            if(compare === 0) compare = a.id - b.id

            return sortConfig.direction === 'ASC' ? compare : -compare
        }, [data, sortConfig])
    })

    
    return { sortConfig, sortedData, handleOnSort, handleSetDirection }
}