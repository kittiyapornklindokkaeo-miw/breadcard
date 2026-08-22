import SortData from "../../components/ui/SortData"
import MainTopic from "../../components/ui/MainTopic"
import Search from "../../components/ui/Search"
import Button from "../../components/ui/Button"
import CardCategory from "../../components/card/CardCategory"
import { useEffect, useState } from "react"
import Modal from "../../components/modal/Modal"
import FormCategory from "../../components/form/FormCategory"
import { useCreate } from "../../hook/useCreate"
import { useAuth } from "../../context/AuthContext"
import { useFetch } from "../../hook/useFetch"
import { useRemove } from "../../hook/useRemove"
import { useModalManager } from "../../hook/useModalManager"
import FormRemove from "../../components/form/FormRemove"
import { useEdit } from "../../hook/useEdit"
import FormVocabulary from "../../components/form/FormVocabulary"
import { create, list, remove, edit } from "../../api/vocabulary"
import { Link, useParams } from "react-router"
import TableVocabulary from "../../components/table/TableVocabulary"
import ButtonPlay from "../../components/ui/ButtonPlay"
import { useSearch } from "../../hook/useSearch"
import { useSort } from "../../hook/useSort"

const validateVocab = (data) => {
    const errors = {}
    if (!data.word.trim()) {
        errors.word = 'กรุณากรอกคำศัพท์'
    }
    return errors
}

const Vocabulary = () => {
    const { user } = useAuth()
    const { id } = useParams()
    const { openModal, closeModal, currentModal } = useModalManager()
    const { data, setData, isLoading: isFecthing, handleGetData } = useFetch(list)
    const { sortConfig, sortedData, handleOnSort, handleSetDirection } = useSort(data)
    //เพิ่ม
    const { error, isCreating, form, setForm, onChange, handleSubmit, closeModalCreate } = useCreate(create, {
        initialForm: { word: '', pinyin: '', meaning: '', deck_id: id },
        validate: validateVocab,
        closeModal,
        onSuccess: () => { closeModalCreate(); handleGetData(id) }
    })
    // //ลบ
    const { selectId, setSelectId, isLoading: isRemoving, handleRemove, openModalRemove, closeModalRemove } = useRemove(remove, {
        openModal: () => openModal('removeVocab'),
        closeModal,
        onSuccess: () => { closeModalRemove(); handleGetData(id) }
    })
    //แก้ไข
    const { isEditing, error: errorEdit, formEdit, setFormEdit, openModalEdit, closeModalEdit, handleEdit, onChangeEdit } = useEdit(edit, {
        initialForm: { word: '', pinyin: '', meaning: '' },
        validate: validateVocab,
        openModal: () => openModal('editVocab'),
        closeModal,
        onSuccess: () => { closeModalEdit(); handleGetData(id) }
    })

    useEffect(() => {
        handleGetData(id)
    }, [user, handleGetData])

    return (
        <div className="space-y-10">
            <div className="w-full flex justify-center">
                <MainTopic topic="คำศัพท์" total={sortedData?.length} />
            </div>

            <div className="space-y-5 font-itim">
                {/* search filter add */}
                <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between md:items-baseline-last">
                    <Link to={`/play-vocabulary/${id}`}>
                        <ButtonPlay />
                    </Link>
                    <div className="flex gap-3">
                        <SortData
                            onDirection={handleSetDirection}
                            onSort={handleOnSort}
                            sortConfig={sortConfig}
                            column={[{ key: 'pinyin', title: 'พินอิน' }, { key: 'meaning', title: 'ความหมาย' }]}
                        />
                        <Button
                            onClick={() => openModal('createVocab')}
                            variant="secondary"
                            type="button"
                            children="เพิ่มคำศัพท์"
                        />
                    </div>
                </div>
                {/* card category */}
                <div className="">
                    {isFecthing ? (
                        <p className="text-center">กำลังโหลดข้อมูล...</p>
                    ) : sortedData?.length === 0 ? (
                        <p className="text-center">ยังไม่มีคำศัพท์</p>
                    ) : (<TableVocabulary data={sortedData} onDelete={openModalRemove} onEdit={openModalEdit} />)
                    }
                </div>
            </div>
            {
                currentModal === 'createVocab' && (
                    <Modal closeOnOutsideClick={false}>
                        <FormVocabulary
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
                currentModal === 'removeVocab' && (
                    <Modal closeOnOutsideClick={false}>
                        <FormRemove
                            type="คำศัพท์"
                            onConfirm={handleRemove}
                            additional="ถ้าคุณลบคำศัพท์นี้ ชุดคำศัพท์ที่อยู่ภายในคำศัพท์นี้จะถูกลบไปด้วย"
                            onClose={closeModalRemove}
                            isLoading={isRemoving}
                        />
                    </Modal>
                )
            }
            {
                currentModal === 'editVocab' && (
                    <Modal closeOnOutsideClick={false}>
                        <FormVocabulary
                            type="edit"
                            form={formEdit}
                            setForm={setFormEdit}
                            onSubmit={handleEdit}
                            onClose={closeModalEdit}
                            onChange={onChangeEdit}
                            error={errorEdit}
                            isLoading={isEditing}
                            typeImg="vocabulary"
                        />
                    </Modal>
                )
            }
        </div>
    )
}
export default Vocabulary