import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import Button from "../ui/Button"
import { RiUser5Fill } from "react-icons/ri"
import UploadProfile from "../ui/UploadProfile"
import InputWithLabel from "../ui/InputWithLabel"
import { dateFormat } from "../../utils/dateFormat"
import Google from "../../assets/google.png"
import Facebook from "../../assets/facebook.png"
import Email from "../../assets/gmail.png"
import { useUploadImage } from "../../hook/useUploadImage"
import { useEdit } from "../../hook/useEdit"
import { remove, update } from "../../api/user"
import { LuLoaderCircle } from "react-icons/lu"
import { useModal } from "../../hook/useModal"
import Modal from "../modal/Modal"
import FormRemove from "./FormRemove"
import { useRemove } from "../../hook/useRemove"
import { useNavigate } from "react-router"

const providerData = [
    { label: 'GOOGLE', title: 'ลงชื่อเข้าใช้ด้วย Google', logo: Google },
    { label: 'FACEBOOK', title: 'ลงชื่อเข้าใช้ด้วย Facebook', logo: Facebook },
    { label: 'EMAIL', title: 'ลงชื่อเข้าใช้ด้วย Email', logo: Email },
]

const validateProfile = (data) => {
    const errors = {}
    if (!data.name.trim()) {
        errors.name = 'กรุณากรอกชื่อผู้ใช้'
    }
    return errors
}

const getInitialValues = (u) => ({
    name: u?.name ?? '',
    url: u?.url ?? '',
    public_id: u?.public_id ?? ''
})

const FormProfile = () => {
    const navigate = useNavigate()
    const { user, setUser } = useAuth()
    const [edit, setEdit] = useState(false)
    const { isOpen, openModal, closeModal } = useModal()
    const { isEditing, error, formEdit, setFormEdit, handleEdit, onChangeEdit } = useEdit(update, {
        initialForm: getInitialValues(user),
        validate: validateProfile,
        onSuccess: () => {
            setEdit(false)
            setUser(prev => ({ ...prev, ...formEdit }))
        }
    })
    const { isLoading: isRemoving, handleRemove } = useRemove(remove, {
        onSuccess: async () => {
            closeModal()
            setUser(null)
            navigate('/')
        }
    })
    //hook อัปโหลดรูปภาพ
    const { isLoading, error: errImg, handleOnChange } = useUploadImage(formEdit, setFormEdit, "profile")

    useEffect(() => {
        if (user) {
            setFormEdit(getInitialValues(user))
        }
    }, [user])

    const provider = providerData.find(
        (i) => i.label === (user?.provider ?? 'EMAIL').toUpperCase()
    )

    const initialValues = { name: user?.name ?? '', url: user?.url ?? '', public_id: user?.public_id ?? '' }
    const isChanged = JSON.stringify(formEdit) !== JSON.stringify(getInitialValues(user))
    return (
        <div className="sm:w-sm space-y-5 font-itim">
            <div className="grid justify-items-center gap-1">
                <div className="relative w-30 h-30 border border-stone-200 rounded-lg overflow-clip">
                    {isLoading
                        ? (
                            <>
                                <div className="w-full h-full bg-stone-300/50 flex justify-center items-center">
                                    <LuLoaderCircle color='#ffffff' size={20} className='animate-spin' />
                                </div></>
                        )
                        : (
                            <>
                                {user?.url
                                    ? (<img src={formEdit.url} alt={`profile ${user?.name}`} className="w-full h-full object-cover" />)
                                    : (<div className="bg-stone-200 w-full h-full"><RiUser5Fill className="w-full h-full fill-stone-300" /></div>)
                                }
                                {edit && (<div className="absolute bottom-2 right-2"><UploadProfile onChange={handleOnChange} /></div>)}</>
                        )
                    }
                </div>
                <p className="text-xs text-accent">{errImg}</p>
                <h1 className="capitalize font-bold text-lg">{user?.name}</h1>
                <button className="flex justify-center items-center gap-2 border border-secondary-content py-1 px-2 rounded-full">
                    <img src={provider.logo} className="w-5 h-5" alt={`${provider.label}`} />
                    <p className="text-xs text-stone-400">{provider.title}</p>
                </button>
            </div>
            <form method="post" onSubmit={handleEdit} className="space-y-5">
                <div className="space-y-3">
                    <InputWithLabel
                        type="email"
                        title="อีเมลล์"
                        value={user?.email}
                        name="email"
                        style="w-full"
                        placeholder="อีเมลล์..."
                        disabled
                    />
                    <InputWithLabel
                        type="text"
                        title="ชื่อผู้ใช้งาน"
                        value={formEdit.name}
                        error={error.name}
                        name="name"
                        style="w-full"
                        placeholder="ชื่อผู้ใช้งาน..."
                        disabled={!edit}
                        onChange={onChangeEdit}
                    />
                </div>
                <p className="text-center text-xs text-stone-400 tracking-wide">วันที่เข้าร่วม {dateFormat(user?.createdAt)}</p>
                <div>
                    {edit ? (
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                onClick={() => {
                                    setEdit(false)
                                    setFormEdit(getInitialValues(user))
                                }}
                                children="ยกเลิก"
                                variant="outline"
                                width="w-full"
                            />

                            <Button
                                type="submit"
                                children="บันทึก"
                                variant="secondary"
                                width="w-full"
                                isLoading={isEditing}
                                disabled={!isChanged}
                            />
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                onClick={() => setEdit(true)}
                                children="แก้ไข"
                                variant="outline"
                                width="w-full"
                            />
                            <Button
                                type="button"
                                onClick={openModal}
                                children="ลบบัญชี"
                                variant="primary"
                                width="w-full"
                            />
                        </div>
                    )}
                </div>
            </form>
            {isOpen && (
                <Modal closeOnOutsideClick={false}>
                    <FormRemove
                        type="บัญชีผู้ใช้"
                        onConfirm={handleRemove}
                        onClose={closeModal}
                        isLoading={isRemoving}
                    />
                </Modal>
            )}
        </div>
    )
}
export default FormProfile