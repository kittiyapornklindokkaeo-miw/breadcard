import api from "./axios";

export const create = (form) => api.post('/deck', form)
export const listDeck = () => api.get('/deck')
export const edit = (id, form) => api.patch(`/deck/${id}`, form)
export const save = (id) => api.post(`/deck/${id}/save`)
export const playAgain = (id) => api.post(`/deck/${id}/session/reset`)
export const remove = (id) => api.delete(`/deck/${id}`)