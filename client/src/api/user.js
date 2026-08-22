import api from "./axios";

export const update = (form) => api.patch('/user', form)
export const remove = () => api.delete('/user')