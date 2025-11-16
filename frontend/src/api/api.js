import axios from 'axios';

// VITE_API_URL environment variable'dan foydalaning
// Agar u mavjud bo'lmasa, localhost ishlatiladi (development uchun)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,  // /api qo'shildi
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,  // CORS uchun (session authentication)
});

// CSRF token olish va saqlash
let csrfToken = null;

export const getCsrfToken = async () => {
  if (!csrfToken) {
    try {
      const response = await api.get('/products/auth/csrf/');
      csrfToken = response.data.csrfToken;
    } catch (error) {
      console.error('CSRF token olishda xato:', error);
    }
  }
  return csrfToken;
};

// Request interceptor - har bir POST, PUT, PATCH, DELETE requestga CSRF token qo'shish
api.interceptors.request.use(
  async (config) => {
    if (['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      const token = await getCsrfToken();
      if (token) {
        config.headers['X-CSRFToken'] = token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xatolarni ko'rish uchun
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

// Public endpoints
export const getCategories = () => api.get('/products/categories/');
export const getProducts = (params = {}) => api.get('/products/', { params });
export const getFeaturedProducts = () => api.get('/products/featured/');
export const getProductBySlug = (slug) => api.get(`/products/${slug}/`);
export const sendContactMessage = (data) => api.post('/contact/', data);

// Auth endpoints
export const login = (username, password) => api.post('/products/auth/login/', { username, password });
export const logout = () => api.post('/products/auth/logout/');
export const checkAuth = () => api.get('/products/auth/check/');

// Admin Auth endpoints
export const adminLogin = (username, password) => api.post('/products/auth/admin/login/', { username, password });
export const checkAdminAuth = () => api.get('/products/auth/admin/check/');

// Admin endpoints
export const getAdminProducts = (params = {}) => api.get('/products/admin/products/', { params });
export const createProduct = (formData) => {
  return api.post('/products/admin/products/create/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const updateProduct = (id, formData) => {
  return api.patch(`/products/admin/products/${id}/update/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const deleteProduct = (id) => api.delete(`/products/admin/products/${id}/delete/`);

export default api;