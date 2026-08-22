import api from "./axios";

export const create = (form) => api.post('/category', form)
export const listCategory = () => api.get('/category')
export const edit = (id, form) => api.patch(`/category/${id}`, form)
export const remove = (id) => api.delete(`/category/${id}`)

export const removeDeck = (id, deckId) => api.patch(`/category/deck/${id}`, deckId)