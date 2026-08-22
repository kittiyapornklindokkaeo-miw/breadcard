import { useEffect } from "react";
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast";
import { Navigate } from "react-router";

const ProtectedRoute = ({ el }) => {
    const { user, isLoading, isLoggingOutRef } = useAuth();
    const isSignedIn = !!user

    useEffect(() => {
        if (!isLoading && !isSignedIn && !isLoggingOutRef.current) {
            toast.error("เกิดข้อผิดพลาด กรุณาลงชื่อเข้าใช้", { duration: 3000 })
        }
    }, [isLoading, isSignedIn])

    if (isLoading) {
        return <div>กำลังโหลด...</div>
    }

    if (!isSignedIn) {
        if (isLoggingOutRef.current) {
            return <Navigate to="/" replace />
        }
        return <Navigate to="/forbidden" replace />
    }

    return el
}
export default ProtectedRoute