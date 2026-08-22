import Logo from "../../assets/logo_black.svg"
import Modal from "../modal/Modal"
import FormRegister from "../form/FormRegister"
import { useModalManager } from "../../hook/useModalManager"
import FormLogin from "../form/FormLogin"
import { useRef, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { loginValidate, registerValidate } from "../../validation/authValidate"
import UserMenu from "./UserMenu"
import AuthButtons from "./AuthButtons"
import toast from "react-hot-toast"
import { register } from "../../api/auth"

const intitialState = {
    email: '',
    password: '',
    rememberMe: false
}

const intitialStateRegis = {
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
}

const Header = () => {
    const { user, handleLogout, handleLogin } = useAuth()
    const { openModal, closeModal, currentModal } = useModalManager()
    const [errors, setErrors] = useState({})
    const [form, setForm] = useState(intitialState)
    const [regisForm, setRegisForm] = useState(intitialStateRegis)
    const modalRef = useRef(null)

    const handleOnChange = (e) => {
        const { name, value, checked, type } = e.target

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    const handleCloseModal = () => {
        closeModal()
        setForm(intitialState)
        setRegisForm(intitialStateRegis)
        setErrors({})
    }

    const handleLoginUser = async (e) => {
        e.preventDefault()
        const errs = loginValidate(form)
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }
        setErrors({})

        try {
            await handleLogin(form)
            setForm(intitialState)
            handleCloseModal()
        } catch (error) {

        }

    }

    //register function
    const handleOnChangeRegis = (e) => {
        const { name, value } = e.target

        setRegisForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleRegister = async (e) => {
        e.preventDefault()

        const errs = registerValidate(regisForm)
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }

        setErrors({})

        try {
            await register(regisForm)
            setRegisForm(intitialStateRegis)
            handleCloseModal()
            openModal('loginModal')
            toast.success('สร้างบัญชีสำเร็จ')
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาด')
        }
    }

    const handleLoginGoogle = () => {
        window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`
    }

    const handleLoginFacebook = () => {
        window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/facebook`
    }

    return (
        <nav className="w-full bg-neutral py-2 flex justify-between items-center">
            <div><img src={Logo} width={70} /></div>
            <ul className="flex items-center gap-5 font-itim text-secondary cursor-pointer">
                <li>
                    {user
                        ? (<UserMenu
                            user={user}
                            logOut={handleLogout}
                        />)
                        : (<AuthButtons
                            onLoginClick={() => openModal('loginModal')}
                        />)
                    }
                </li>
            </ul>
            {currentModal === 'loginModal' && (
                <Modal modalRef={modalRef} onClose={handleCloseModal}>
                    <FormLogin
                        form={form}
                        onSubmit={handleLoginUser}
                        onChange={handleOnChange}
                        onSignUp={() => openModal('signupModal')}
                        error={errors}
                        google={handleLoginGoogle}
                        facebook={handleLoginFacebook}
                    />
                </Modal>
            )}
            {currentModal === 'signupModal' && (
                <Modal modalRef={modalRef} onClose={handleCloseModal}>
                    <FormRegister
                        form={regisForm}
                        onSubmit={handleRegister}
                        onChange={handleOnChangeRegis}
                        error={errors}
                        google={handleLoginGoogle}
                        facebook={handleLoginFacebook}
                    />
                </Modal>
            )}
        </nav >
    )
}
export default Header