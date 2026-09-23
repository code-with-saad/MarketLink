import api from './axiosInstance';

// Markets
export const getMarkets = () => api.get('/customer/markets');
export const getMarketFarmers = (id) => api.get(`/customer/markets/${id}/farmers`);

// Products: accepts query params object: { category, price, market, day }
export const getProducts = (params) => api.get('/customer/products', { params });


// Orders
export const createOrder = (data) => api.post('/customer/orders', data);
export const getOrders = () => api.get('/customer/orders');
export const cancelOrder = (id) => api.put(`/customer/orders/${id}/cancel`);

// Favorites
export const addFavorite = (data) => api.post('/customer/favorites', data);
export const getFavorites = () => api.get('/customer/favorites');

// Reviews
export const createReview = (data) => api.post('/customer/reviews', data);
