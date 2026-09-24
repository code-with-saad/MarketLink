import api from './axiosInstance';

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);
export const resendOtp = (data) => api.post('/auth/resend-otp', data);
export const resetPassword = (data) => api.post('/auth/reset-password', data);
