const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const {
  getDashboard,
  getFarmers,
  approveFarmer,
  suspendFarmer,
  getCustomers,
  updateCustomerStatus,
  getMarkets,
  createMarket,
  updateMarket,
  deleteMarket,
  deleteReview,
  deleteProduct,
  getReports,
} = require('../controllers/adminController');

// All admin routes are protected
router.use(verifyToken, requireRole('admin'));

// GET /api/admin/dashboard
router.get('/dashboard', getDashboard);

// GET /api/admin/farmers
router.get('/farmers', getFarmers);
// PUT /api/admin/farmers/:id/approve
router.put('/farmers/:id/approve', approveFarmer);
// PUT /api/admin/farmers/:id/suspend
router.put('/farmers/:id/suspend', suspendFarmer);

// GET /api/admin/customers
router.get('/customers', getCustomers);
// PUT /api/admin/customers/:id/status
router.put('/customers/:id/status', updateCustomerStatus);

// GET /api/admin/markets
router.get('/markets', getMarkets);
// POST /api/admin/markets
router.post('/markets', createMarket);
// PUT /api/admin/markets/:id
router.put('/markets/:id', updateMarket);
// DELETE /api/admin/markets/:id
router.delete('/markets/:id', deleteMarket);

// DELETE /api/admin/reviews/:id  (moderation)
router.delete('/reviews/:id', deleteReview);
// DELETE /api/admin/products/:id  (moderation)
router.delete('/products/:id', deleteProduct);

// GET /api/admin/reports
router.get('/reports', getReports);

module.exports = router;
