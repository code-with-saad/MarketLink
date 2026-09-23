const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const {
  getMarkets,
  getMarketFarmers,
  getProducts,
  createOrder,
  getOrders,
  cancelOrder,
  addFavorite,
  getFavorites,
  createReview,
} = require('../controllers/customerController');

// All customer routes are protected
router.use(verifyToken, requireRole('customer'));

// GET /api/customer/markets
router.get('/markets', getMarkets);
// GET /api/customer/markets/:id/farmers
router.get('/markets/:id/farmers', getMarketFarmers);

// GET /api/customer/products   (query: category, price, market, day)
router.get('/products', getProducts);

// POST /api/customer/orders
router.post('/orders', createOrder);
// GET /api/customer/orders
router.get('/orders', getOrders);
// PUT /api/customer/orders/:id/cancel
router.put('/orders/:id/cancel', cancelOrder);

// POST /api/customer/favorites
router.post('/favorites', addFavorite);
// GET /api/customer/favorites
router.get('/favorites', getFavorites);

// POST /api/customer/reviews
router.post('/reviews', createReview);

module.exports = router;
