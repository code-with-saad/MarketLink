import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { navigateTo } from '../utils/navigation';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hasToken = Boolean(localStorage.getItem('token'));
      store.dispatch(logout());

      if (hasToken) {
        const path = window.location.pathname;
        const isProtectedRoute =
          path.startsWith('/customer') ||
          path.startsWith('/farmer') ||
          path.startsWith('/admin');

        if (isProtectedRoute) {
          navigateTo('/login?reason=expired');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
