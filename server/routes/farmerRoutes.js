const express = require('express');
const router = express.Router();
const { verifyToken, requireRole, requireActiveUser } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  getProducts,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  updateWeeklyTemplateSettings,
  applyWeeklyTemplate,
  getOrders,
  updateOrderStatus,
  getInsights,
  getReviews,
  respondToReview,
} = require('../controllers/farmerController');

// All farmer routes are protected
router.use(verifyToken, requireRole('farmer'));

// Profile routes: pending farmers can view and update their profile
// GET /api/farmer/profile
router.get('/profile', getProfile);
// PUT /api/farmer/profile
router.put('/profile', updateProfile);

// Product management routes (blocked if pending or suspended)
// GET /api/farmer/products
router.get('/products', requireActiveUser, getProducts);
// POST /api/farmer/products
router.post('/products', requireActiveUser, createProduct);
// PUT /api/farmer/products/:id/status (quick status change)
router.put('/products/:id/status', requireActiveUser, updateProductStatus);
// PUT /api/farmer/products/:id
router.put('/products/:id', requireActiveUser, updateProduct);
// DELETE /api/farmer/products/:id
router.delete('/products/:id', requireActiveUser, deleteProduct);

// Weekly template endpoints
// PUT /api/farmer/weekly-template (batch update weekly template values or settings)
router.put('/products/weekly-template', requireActiveUser, updateWeeklyTemplateSettings);
// POST /api/farmer/apply-weekly-template (apply template to stock)
router.post('/products/apply-weekly-template', requireActiveUser, applyWeeklyTemplate);

// Orders & insights routes (blocked if pending or suspended)
// GET /api/farmer/orders
router.get('/orders', requireActiveUser, getOrders);
// PUT /api/farmer/orders/:id/status
router.put('/orders/:id/status', requireActiveUser, updateOrderStatus);

// GET /api/farmer/insights
router.get('/insights', requireActiveUser, getInsights);

// Reviews routes
// GET /api/farmer/reviews
router.get('/reviews', requireActiveUser, getReviews);
// POST /api/farmer/reviews/:id/respond
router.post('/reviews/:id/respond', requireActiveUser, respondToReview);

module.exports = router;

