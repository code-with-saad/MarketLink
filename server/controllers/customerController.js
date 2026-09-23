const getMarkets = async (req, res) => {

  res.status(501).json({ message: 'Not implemented yet' });
};

const getMarketFarmers = async (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

const getProducts = async (req, res) => {
  // Query params: category, price, market, day
  res.status(501).json({ message: 'Not implemented yet' });
};

const createOrder = async (req, res) => {
  // Must calculate and store cutoff_time at placement time
  res.status(501).json({ message: 'Not implemented yet' });
};

const getOrders = async (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

const cancelOrder = async (req, res) => {
  // Only allowed while now < cutoff_time
  res.status(501).json({ message: 'Not implemented yet' });
};

const addFavorite = async (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

const getFavorites = async (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

const createReview = async (req, res) => {
  // Supports farmer-level (product_id omitted) and product-level reviews
  res.status(501).json({ message: 'Not implemented yet' });
};

module.exports = {
  getMarkets,
  getMarketFarmers,
  getProducts,
  createOrder,
  getOrders,
  cancelOrder,
  addFavorite,
  getFavorites,
  createReview,
};
