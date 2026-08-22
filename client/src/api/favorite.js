import api from "./axios";

export const createFavorite = (deck_id) => api.post('/favorite', { deck_id})
export const list = () => api.get('/favorite')