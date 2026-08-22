import { useEffect } from "react"
import { create, edit, listDeck, remove } from "../../api/deck"
import { listCategory } from "../../api/category"
import Button from "../../components/ui/Button"
import MainTopic from "../../components/ui/MainTopic"
import Search from "../../components/ui/Search"
import SortData from "../../components/ui/SortData"
import { useAuth } from "../../context/AuthContext"
import { useFetch } from "../../hook/useFetch"
import { useCreate } from "../../hook/useCreate"
import CardDeck from "../../components/card/CardDeck"
import { useModalManager } from "../../hook/useModalManager"
import FormDeck from "../../components/form/FormDeck"
import Modal from "../../components/modal/Modal"
import { useEdit } from "../../hook/useEdit"
import { useRemove } from "../../hook/useRemove"
import FormRemove from "../../components/form/FormRemove"
import toast from "react-hot-toast"
import { createFavorite } from "../../api/favorite"
import { useSearch } from "../../hook/useSearch"
import { useSort } from "../../hook/useSort"

const validateDeck = (data) => {
    const errors = {}
    if (!data.deck_name.trim()) {
        errors.deck_name = 'กรุณากรอกชื่อชุดคำศัพท์'
    }
    return errors
}

const Deck = () => {
    const { user } = useAuth()
    const { openModal, closeModal, currentModal } = useModalManager()
    const { data, setData, isLoading: isFecthing, handleGetData } = useFetch(listDeck)
    const { data: category, handleGetData: handlGetCategory } = useFetch(listCategory)
    const { filteredData, textSearch, setTextSearch } = useSearch(data, 'deck_name')
    const { sortConfig, sortedData, handleOnSort, handleSetDirection } = useSort(filteredData)
    //เพิ่ม
    const { error, isCreating, form, onChange, handleSubmit, closeModalCreate } = useCreate(create, {
        initialState: { deck_name: '' },
        validate: validateDeck,
        closeModal,
        onSuccess: () => { closeModalCreate(); handleGetData() }
    })
    //แก้ไข
    const { isEditing, error: errorEdit, formEdit, setFormEdit, openModalEdit, closeModalEdit, handleEdit, onChangeEdit } = useEdit(edit, {
        initialForm: { deck_name: '', category_id: '' },
        validate: validateDeck,
        openModal: () => openModal('editDeck'),
        closeModal,
        onSuccess: () => { closeModalEdit(); handleGetData() }
    })

    //ลบ
    const { selectId, setSelectId, isLoading: isRemoving, handleRemove, openModalRemove, closeModalRemove } = useRemove(remove, {
        openModal: () => openModal('removeDeck'),
        closeModal,
        onSuccess: () => { closeModalRemove(); handleGetData() }
    })

    useEffect(() => {
        handleGetData()
        handlGetCategory()
    }, [user, handleGetData, handlGetCategory])

    const handleToggleFavorite = async (id, currentStatus) => {
        try {
            if (!id) return

            const res = await createFavorite(id)
            setData(prev => prev.map(i => i.id === id ? { ...i, isFavorite: !currentStatus } : i))
            toast.success(res.data.message)
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)
        }
    }
    return (
        <div className="space-y-10">
            <div className="w-full flex justify-center">
                <MainTopic topic="ชุดคำศัพท์" total={sortedData?.length} />
            </div>

            <div className="space-y-5 font-itim">
                {/* search filter add */}
                <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
                    <div className="flex gap-3">
                        <Search value={textSearch} onChange={(e) => setTextSearch(e.target.value)} />
                        <Button
                            onClick={() => openModal('createDeck')}
                            variant="secondary"
                            type="button"
                            children="เพิ่มชุดคำศัพท์"
                        />

                    </div>
                    <SortData
                        onDirection={handleSetDirection}
                        onSort={handleOnSort}
                        sortConfig={sortConfig}
                        column={[{ key: 'deck_name', title: 'ชื่อชุดคำศัพท์' }, { key: 'max_point', title: 'แต้มสูงสุด' }, { key: 'createdAt', title: 'วันที่สร้าง' }]}
                    />
                </div>
                {/* card deck */}
                <div>
                    {isFecthing ? (
                        <p className="text-center">กำลังโหลดข้อมูล...</p>
                    ) : sortedData?.length === 0 ? (
                        <p className="text-center">ยังไม่มีชุดคำศัพท์</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                            {
                                sortedData?.map((i) => (
                                    <CardDeck
                                        key={i.id}
                                        data={i}
                                        status={i.isFavorite}
                                        onDelete={() => openModalRemove(i.id)}
                                        onEdit={() => openModalEdit(i)}
                                        onFavorite={() => handleToggleFavorite(i.id, i.isFavorite)}
                                    />
                                ))}
                        </div>
                    )}
                </div>
            </div>
            {
                currentModal === 'createDeck' && (
                    <Modal closeOnOutsideClick={false}>
                        <FormDeck
                            type="create"
                            form={form}
                            error={error}
                            category={category}
                            isLoading={isCreating}
                            onChange={onChange}
                            onSubmit={handleSubmit}
                            onClose={closeModalCreate}
                        />
                    </Modal>
                )
            }
            {
                currentModal === 'editDeck' && (
                    <Modal closeOnOutsideClick={false}>
                        <FormDeck
                            type="edit"
                            form={formEdit}
                            category={category}
                            error={errorEdit}
                            isLoading={isEditing}
                            onChange={onChangeEdit}
                            onSubmit={handleEdit}
                            onClose={closeModalEdit}
                        />
                    </Modal>
                )
            }
            {
                currentModal === 'removeDeck' && (
                    <Modal closeOnOutsideClick={false}>
                        <FormRemove
                            type="ชุดคำศัพท์"
                            onConfirm={handleRemove}
                            additional="ถ้าคุณลบชุดคำศัพท์นี้ คำศัพท์ที่อยู่ภายในชุดคำศัพท์นี้จะถูกลบไปด้วย"
                            onClose={closeModalRemove}
                            isLoading={isRemoving}
                        />
                    </Modal>
                )
            }
        </div>
    )
}
export default Deck