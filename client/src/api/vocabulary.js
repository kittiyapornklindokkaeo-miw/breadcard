import api from "./axios";

export const create = (form) => api.post('/vocabulary', form)
export const list = (id) => api.get(`/vocabulary/${id}`)
export const edit = (id, form) => api.patch(`/vocabulary/${id}`, form)
export const remove = (id) => api.delete(`/vocabulary/${id}`)