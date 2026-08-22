import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getMe, login, logout } from "../api/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const isLoggingOutRef = useRef(false)

    //ตรวจสอบ session ทุกครั้งที่เปิดหน้าเว็บ
    useEffect(() => {
        const currentUser = async () => {
            try {
                const res = await getMe()
                setUser(res.data)
            } catch (error) {
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }
        currentUser()
    }, [])

    const handleLogin = async (form) => {
        try {
            await login(form)
            const res = await getMe()
            setUser(res.data)
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาด')
            throw error
        }
    }

    const handleLogout = async () => {
        isLoggingOutRef.current = true
        await logout()
        setUser(null)
        navigate('/', { replace: true })
    }

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading, isLoggingOutRef, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)