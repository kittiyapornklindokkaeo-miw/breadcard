import { useEffect } from "react"
import { createFavorite, list } from "../../api/favorite"
import Button from "../../components/ui/Button"
import MainTopic from "../../components/ui/MainTopic"
import Search from "../../components/ui/Search"
import SortData from "../../components/ui/SortData"
import { useAuth } from "../../context/AuthContext"
import { useFetch } from "../../hook/useFetch"
import CardDeck from "../../components/card/CardDeck"
import toast from "react-hot-toast"
import { useSearch } from "../../hook/useSearch"
import { useSort } from "../../hook/useSort"

const Favorite = () => {
    const { user } = useAuth()
    const { data, isLoading, handleGetData } = useFetch(list)
    const { filteredData, textSearch, setTextSearch } = useSearch(data, 'deck_name')
    const { sortConfig, sortedData, handleOnSort, handleSetDirection } = useSort(filteredData)

    useEffect(() => {
        handleGetData()
    }, [user, handleGetData])

    const handleToggleFavorite = async (id, currentStatus) => {
        try {
            if (!id) return

            const res = await createFavorite(id)
            handleGetData()
            toast.success(res.data.message)
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)
        }
    }
    return (
        <div className="space-y-10">
            <div className="w-full flex justify-center">
                <MainTopic topic="รายการชื่นชอบ" total={sortedData?.length} />
            </div>
            <div className="space-y-5 font-itim">
                {/* search filter add */}
                <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
                    <Search value={textSearch} onChange={(e) => setTextSearch(e.target.value)} />
                    <SortData
                        onDirection={handleSetDirection}
                        onSort={handleOnSort}
                        sortConfig={sortConfig}
                        column={[{ key: 'deck_name', title: 'ชื่อชุดคำศัพท์' }, { key: 'max_point', title: 'แต้มสูงสุด' }, { key: 'createdAt', title: 'วันที่สร้าง' }]}
                    />
                </div>
                <div>
                    {isLoading ? (
                        <p className="text-center">กำลังโหลดข้อมูล...</p>
                    ) : sortedData?.length === 0 ? (
                        <p className="text-center">ยังไม่มีรายการชื่นชอบ</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                            {sortedData?.map((i) => (
                                <CardDeck
                                    key={i.id}
                                    data={i}
                                    status={i.isFavorite}
                                    variant
                                    onFavorite={() => handleToggleFavorite(i.id, i.isFavorite)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Favorite