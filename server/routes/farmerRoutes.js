const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  getInsights,
  getReviews,
  respondToReview,
} = require('../controllers/farmerController');

// All farmer routes are protected
router.use(verifyToken, requireRole('farmer'));

// GET /api/farmer/profile
router.get('/profile', getProfile);
// PUT /api/farmer/profile
router.put('/profile', updateProfile);

// GET /api/farmer/products
router.get('/products', getProducts);
// POST /api/farmer/products
router.post('/products', createProduct);
// PUT /api/farmer/products/:id
router.put('/products/:id', updateProduct);
// DELETE /api/farmer/products/:id
router.delete('/products/:id', deleteProduct);

// GET /api/farmer/orders
router.get('/orders', getOrders);
// PUT /api/farmer/orders/:id/status
router.put('/orders/:id/status', updateOrderStatus);

// GET /api/farmer/insights
router.get('/insights', getInsights);

// GET /api/farmer/reviews
router.get('/reviews', getReviews);
// POST /api/farmer/reviews/:id/respond
router.post('/reviews/:id/respond', respondToReview);

module.exports = router;
