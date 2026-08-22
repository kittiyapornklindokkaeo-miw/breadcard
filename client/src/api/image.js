import api from "./axios";

//ส่ง image, id, type
export const create = (formData) => api.post('/image', formData, { headers: {'Content-Type': 'multipart/form-data'} })
export const remove = (public_id) => api.delete('/image', { data:  { public_id }})