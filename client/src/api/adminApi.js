// adminApi.js — Dev 4 owns this file
import api from './axiosInstance';

// Dashboard
export const getDashboard = () => api.get('/admin/dashboard');

// Farmers
export const getFarmers = () => api.get('/admin/farmers');
export const approveFarmer = (id) => api.put(`/admin/farmers/${id}/approve`);
export const suspendFarmer = (id) => api.put(`/admin/farmers/${id}/suspend`);

// Customers
export const getCustomers = () => api.get('/admin/customers');
export const updateCustomerStatus = (id, data) => api.put(`/admin/customers/${id}/status`, data);

// Markets
export const getMarkets = () => api.get('/admin/markets');
export const createMarket = (data) => api.post('/admin/markets', data);
export const updateMarket = (id, data) => api.put(`/admin/markets/${id}`, data);
export const deleteMarket = (id) => api.delete(`/admin/markets/${id}`);

// Moderation
export const deleteReview = (id) => api.delete(`/admin/reviews/${id}`);
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);

// Reports
export const getReports = () => api.get('/admin/reports');
