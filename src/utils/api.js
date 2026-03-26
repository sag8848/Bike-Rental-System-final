import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token on every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
};

export const bikeAPI = {
  getAll: (params) => API.get('/bikes', { params }),
  getById: (id) => API.get(`/bikes/${id}`),
  getAllAdmin: () => API.get('/bikes/admin/all'),
  create: (data) => API.post('/bikes', data),
  update: (id, data) => API.put(`/bikes/${id}`, data),
  delete: (id) => API.delete(`/bikes/${id}`),
};

export const bookingAPI = {
  create: (data) => API.post('/bookings', data),
  getMyBookings: () => API.get('/bookings/my'),
  getAll: (params) => API.get('/bookings', { params }),
  updateStatus: (id, status) => API.put(`/bookings/${id}/status`, { status }),
  processPayment: (id, data) => API.put(`/bookings/${id}/pay`, data),
  cancel: (id) => API.put(`/bookings/${id}/cancel`),
};

export const reviewAPI = {
  create: (data) => API.post('/reviews', data),
};

export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: (params) => API.get('/admin/users', { params }),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
};

export default API;
