import axios from 'axios';

const api = axios.create({
<<<<<<< HEAD
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
=======

  baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,

  baseURL: '/api',
  withCredentials: true,

>>>>>>> 19df0e5d8d7acdd7018e85ca2f2b1f4404e9e2c6
});

export const ejecutivos = {
  getAll: () => api.get('/ejecutivos/'),
  get: (id) => api.get(`/ejecutivos/${id}/`),
  create: (data) => api.post('/ejecutivos/', data),
  update: (id, data) => api.put(`/ejecutivos/${id}/`, data),
  delete: (id) => api.delete(`/ejecutivos/${id}/`),
};

export const clientes = {
  getAll: (params) => api.get('/clientes/', { params }),
  get: (id) => api.get(`/clientes/${id}/`),
  create: (data) => api.post('/clientes/', data),
  update: (id, data) => api.put(`/clientes/${id}/`, data),
  delete: (id) => api.delete(`/clientes/${id}/`),
};

export const reuniones = {
  getAll: (params) => api.get('/reuniones/', { params }),
  get: (id) => api.get(`/reuniones/${id}/`),
  create: (data) => api.post('/reuniones/', data),
  update: (id, data) => api.put(`/reuniones/${id}/`, data),
  delete: (id) => api.delete(`/reuniones/${id}/`),
};

export const propuestas = {
  getAll: (params) => api.get('/propuestas/', { params }),
  get: (id) => api.get(`/propuestas/${id}/`),
  create: (data) => api.post('/propuestas/', data),
  update: (id, data) => api.put(`/propuestas/${id}/`, data),
  delete: (id) => api.delete(`/propuestas/${id}/`),
};

export const proyectos = {
  getAll: (params) => api.get('/proyectos/', { params }),
  get: (id) => api.get(`/proyectos/${id}/`),
  create: (data) => api.post('/proyectos/', data),
  update: (id, data) => api.put(`/proyectos/${id}/`, data),
  delete: (id) => api.delete(`/proyectos/${id}/`),
};

export const dashboard = {
  get: () => api.get('/dashboard/'),
};

export const auth = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  getUser: () => api.get('/auth/user/'),
};

export default api;
