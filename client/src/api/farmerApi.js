import api from './axiosInstance';


// Profile
export const getProfile = () => api.get('/farmer/profile');
export const updateProfile = (data) => api.put('/farmer/profile', data);

// Products
export const getProducts = () => api.get('/farmer/products');
export const createProduct = (data) => api.post('/farmer/products', data);
export const updateProduct = (id, data) => api.put(`/farmer/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/farmer/products/${id}`);

// Orders
export const getOrders = () => api.get('/farmer/orders');
export const updateOrderStatus = (id, data) => api.put(`/farmer/orders/${id}/status`, data);

// Insights
export const getInsights = () => api.get('/farmer/insights');

// Reviews
export const getReviews = () => api.get('/farmer/reviews');
export const respondToReview = (id, data) => api.post(`/farmer/reviews/${id}/respond`, data);
