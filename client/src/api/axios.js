import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true
})

api.interceptors.request.use(
    (response) => response, //ถ้าสำเร็จส่งต่อ
    (error) => {
        if(error.response?.status === 401) {
            console.log('[interceptor] got 401, redirecting to /')
            window.location.href = "/"
        }
        return Promise.reject(error)
    }
)

export default api