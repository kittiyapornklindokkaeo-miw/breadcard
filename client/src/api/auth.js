import api from "./axios"

export const login = (form) => api.post("/login", form)

export const logout = () => api.post("/logout")

export const register = (form) => api.post("/register", form)

export const forgotPassword = (email) => api.post("/forgot-password", { email })

export const resetPassword = (form) => api.patch("/reset-password", form)

export const getMe = () => api.get("/me")
