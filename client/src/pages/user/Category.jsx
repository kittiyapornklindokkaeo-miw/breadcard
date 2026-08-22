import SortData from "../../components/ui/SortData"
import MainTopic from "../../components/ui/MainTopic"
import Search from "../../components/ui/Search"
import Button from "../../components/ui/Button"
import CardCategory from "../../components/card/CardCategory"
import { useEffect, useRef, useState } from "react"
import Modal from "../../components/modal/Modal"
import FormCategory from "../../components/form/FormCategory"
import { create, edit, listCategory, remove, removeDeck } from "../../api/category"
import { useCreate } from "../../hook/useCreate"
import { useAuth } from "../../context/AuthContext"
import { useFetch } from "../../hook/useFetch"
import { useRemove } from "../../hook/useRemove"
import { useModalManager } from "../../hook/useModalManager"
import FormRemove from "../../components/form/FormRemove"
import { useEdit } from "../../hook/useEdit"
import { useSearch } from "../../hook/useSearch"
import { useSort } from "../../hook/useSort"
import ModalCategory from "../../components/modal/ModalCategory"
import { createFavorite } from "../../api/favorite"
import toast from "react-hot-toast"

const validateCategory = (data) => {
    const errors = {}
    if (!data.category_name.trim()) {
        errors.category_name = 'กรุณากรอกชื่อหมวดหมู่'
    }
    return errors
}

const Category = () => {
    const { user } = useAuth()
    const modalRef = useRef(null)

    const [details, setDetails] = useState([])
    const [selectedDeckIds, setSelectedDeckIds] = useState([])
    const [selectedCategoryId, setSelectedCategoryId] = useState(null)
    const [isRemovingDeck, setIsRemovingDeck] = useState(false)
    const [clickDelete, setClickDelete] = useState(false)

    const { openModal, closeModal, currentModal } = useModalManager()
    const { data, setData, isLoading: isFecthing, handleGetData } = useFetch(listCategory)
    const { filteredData, textSearch, setTextSearch } = useSearch(data, 'category_name')
    const { sortConfig, sortedData, handleOnSort, handleSetDirection } = useSort(filteredData)
    //เพิ่ม
    const { error, isCreating, form, setForm, onChange, handleSubmit, closeModalCreate } = useCreate(create, {
        initialForm: { category_name: '' },
        validate: validateCategory,
        closeModal,
        onSuccess: () => { closeModalCreate(); handleGetData() }
    })
    //ลบ
    const { isLoading: isRemoving, handleRemove, openModalRemove, closeModalRemove } = useRemove(remove, {
        openModal: () => openModal('removeCategory'),
        closeModal,
        onSuccess: () => { closeModalRemove(); handleGetData() }
    })
    //แก้ไข
    const { isEditing, error: errorEdit, formEdit, setFormEdit, openModalEdit, closeModalEdit, handleEdit, onChangeEdit } = useEdit(edit, {
        initialForm: { category_name: '' },
        validate: validateCategory,
        openModal: () => openModal('editCategory'),
        closeModal,
        onSuccess: () => { closeModalEdit(); handleGetData() }
    })

    useEffect(() => {
        handleGetData()
    }, [user, handleGetData])

    const handleOpenCategoryDetail = (id, detail) => {
        setSelectedCategoryId(id)
        setDetails(detail)
        setSelectedDeckIds([])
        setClickDelete(false)
        openModal('categoryDetails')
    }

    const handleToggleFavorite = async (id, currentStatus) => {
        try {
            if (!id) return

            const res = await createFavorite(id)
            setDetails(prev => prev.map(deck =>
                deck.id === id ? { ...deck, isFavorite: !currentStatus } : deck
            ))

            toast.success(res.data.message)
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)
        }
    }

    const handleCheckDeck = (e) => {
        const deckId = parseInt(e.target.value)

        setSelectedDeckIds(prev =>
            //เช็คว่ามี deckId นี้อยู่หรือยัง
            prev.includes(deckId)
                ? prev.filter(id => id !== deckId) //มีอยู่แล้วเอาออก
                : [...prev, deckId] //ยังไม่มีให้เพิ่มเข้าไป
        )
    }

    const handleDeleteDeck = async () => {
        if (!selectedCategoryId || selectedDeckIds.length === 0) return

        try {
            setIsRemovingDeck(true)
            const res = await removeDeck(selectedCategoryId, { deckId: selectedDeckIds })

            setDetails(prev => prev.filter(deck => !selectedDeckIds.includes(deck.id)))
            setSelectedDeckIds([])

            toast.success(res.data.message)
        } catch (err) {
            console.log(err)
            const message = err?.response?.data.message || 'เกิดข้อผิดพลาด'
            toast.error(message)
        } finally {
            setIsRemovingDeck(false)
        }
    }

    //ปิดตัวเลือกการลบ deck
    const handleOnCloseClickDelete = () => {
        setClickDelete(false)
        setSelectedDeckIds([])
    }

    return (
        <div className="space-y-10">
            <div className="w-full flex justify-center">
                <MainTopic topic="หมวดหมู่" total={sortedData?.length} />
            </div>
            <div className="space-y-5 font-itim">
                {/* search filter add */}
                <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
                    <div className="flex gap-3">
                        <Search value={textSearch} onChange={(e) => setTextSearch(e.target.value)} />
                        <Button
                            onClick={() => openModal('createCategory')}
                            variant="secondary"
                            type="button"
                            children="เพิ่มหมวดหมู่"
                        />
                    </div>
                    <SortData
                        onDirection={handleSetDirection}
                        onSort={handleOnSort}
                        sortConfig={sortConfig}
                        column={[{ key: 'category_name', title: 'ชื่อหมวดหมู่' }, { key: 'createdAt', title: 'วันที่สร้าง' }]}
                    />
                </div>
                {/* card category */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    {isFecthing ? (
                        <p>กำลังโหลดข้อมูล...</p>
                    ) : sortedData?.length === 0 ? (
                        <p>ยังไม่มีหมวดหมู่</p>
                    ) : (
                        sortedData?.map((i) => (
                            <CardCategory
                                key={i.id}
                                data={i}
                                onDelete={() => openModalRemove(i.id)}
                                onEdit={() => openModalEdit(i)}
                                onOpen={() => handleOpenCategoryDetail(i.id, i.decks)}
                            />
                        ))
                    )}
                </div>
            </div>
            {
                currentModal === 'categoryDetails' && (
                    <Modal modalRef={modalRef} onClose={closeModal}>
                        <ModalCategory
                            data={details}
                            deckSelected={selectedDeckIds}
                            clickDelete={clickDelete}
                            setClickDelete={setClickDelete}
                            onFavorite={handleToggleFavorite}
                            onCheck={handleCheckDeck}
                            onDelete={handleDeleteDeck}
                            onClose={handleOnCloseClickDelete}
                        />
                    </Modal>
                )
            }
            {
                currentModal === 'createCategory' && (
                    <Modal closeOnOutsideClick={false}>
                        <FormCategory
                            type="create"
                            form={form}
                            setForm={setForm}
                            onSubmit={handleSubmit}
                            onClose={closeModalCreate}
                            onChange={onChange}
                            error={error}
                            isLoading={isCreating}
                        />
                    </Modal>
                )
            }
            {
                currentModal === 'removeCategory' && (
                    <Modal closeOnOutsideClick={false}>
                        <FormRemove
                            type="หมวดหมู่"
                            onConfirm={handleRemove}
                            additional="ถ้าคุณลบหมวดหมู่นี้ ชุดคำศัพท์ที่อยู่ภายในหมวดหมู่นี้จะถูกลบไปด้วย"
                            onClose={closeModalRemove}
                            isLoading={isRemoving}
                        />
                    </Modal>
                )
            }
            {
                currentModal === 'editCategory' && (
                    <Modal closeOnOutsideClick={false}>
                        <FormCategory
                            type="edit"
                            form={formEdit}
                            setForm={setFormEdit}
                            onSubmit={handleEdit}
                            onClose={closeModalEdit}
                            onChange={onChangeEdit}
                            error={errorEdit}
                            isLoading={isEditing}
                            typeImg="category"
                        />
                    </Modal>
                )
            }
        </div>
    )
}
export default Category