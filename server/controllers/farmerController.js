const FarmerProfile = require('../models/FarmerProfile');
const Product = require('../models/Product');
const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    let profile = await FarmerProfile.findOne({ user_id: req.user.user_id }).populate('markets');
    const user = await User.findById(req.user.user_id).select('name email contact_number address status stall_name');
    
    if (!profile) {
      profile = await FarmerProfile.create({
        user_id: req.user.user_id,
        stall_name: user?.stall_name || '',
        operating_days: [],
        pickup_windows: '',
      });
    }

    return res.json({
      success: true,
      profile: {
        ...profile.toObject(),
        user_status: user ? user.status : 'pending',
        user_name: user ? user.name : '',
        user_email: user ? user.email : '',
        contact_number: user ? user.contact_number : '',
        address: user ? user.address : '',
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { stall_name, markets, operating_days, pickup_windows, latitude, longitude, auto_apply_weekly_template } = req.body;

    let profile = await FarmerProfile.findOne({ user_id: req.user.user_id });
    if (!profile) {
      profile = new FarmerProfile({ user_id: req.user.user_id });
    }

    if (stall_name !== undefined) profile.stall_name = stall_name;
    if (markets !== undefined) profile.markets = markets;
    if (operating_days !== undefined) profile.operating_days = operating_days;
    if (pickup_windows !== undefined) profile.pickup_windows = pickup_windows;
    if (latitude !== undefined) profile.latitude = latitude;
    if (longitude !== undefined) profile.longitude = longitude;
    if (auto_apply_weekly_template !== undefined) profile.auto_apply_weekly_template = auto_apply_weekly_template;

    await profile.save();

    if (stall_name !== undefined) {
      await User.findByIdAndUpdate(req.user.user_id, { stall_name });
    }

    const updatedProfile = await FarmerProfile.findOne({ user_id: req.user.user_id }).populate('markets');

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer_id: req.user.user_id }).sort({ _id: -1 });
    return res.json({ success: true, products });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, category, price, unit, quantity_available, weekly_template_quantity, description, image_url, is_sold_out } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }
    if (price === undefined || price === null || isNaN(Number(price))) {
      return res.status(400).json({ success: false, message: 'Valid price is required' });
    }

    const qty = Number(quantity_available) || 0;
    const tplQty = Number(weekly_template_quantity) || 0;
    const soldOut = is_sold_out !== undefined ? Boolean(is_sold_out) : qty === 0;

    const product = await Product.create({
      farmer_id: req.user.user_id,
      name,
      category: category || 'produce',
      price: Number(price),
      unit: unit || 'lb',
      quantity_available: qty,
      weekly_template_quantity: tplQty,
      description: description || '',
      image_url: image_url || '',
      is_sold_out: soldOut,
    });

    return res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, farmer_id: req.user.user_id });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const fields = ['name', 'category', 'price', 'unit', 'quantity_available', 'weekly_template_quantity', 'description', 'image_url', 'is_sold_out'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    if (req.body.quantity_available !== undefined && req.body.is_sold_out === undefined) {
      if (Number(req.body.quantity_available) === 0) {
        product.is_sold_out = true;
      } else if (Number(req.body.quantity_available) > 0) {
        product.is_sold_out = false;
      }
    }

    await product.save();
    return res.json({ success: true, message: 'Product updated successfully', product });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_sold_out, status } = req.body;

    const product = await Product.findOne({ _id: id, farmer_id: req.user.user_id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (status) {
      if (status === 'sold_out') {
        product.is_sold_out = true;
      } else if (status === 'available') {
        product.is_sold_out = false;
        if (product.quantity_available === 0) product.quantity_available = 10;
      } else if (status === 'unavailable') {
        product.is_sold_out = true;
        product.quantity_available = 0;
      }
    } else if (is_sold_out !== undefined) {
      product.is_sold_out = Boolean(is_sold_out);
    }

    await product.save();
    return res.json({ success: true, message: 'Product status updated', product });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.deleteOne({ _id: id, farmer_id: req.user.user_id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateWeeklyTemplateSettings = async (req, res) => {
  try {
    const { auto_apply_weekly_template, product_templates } = req.body;

    if (auto_apply_weekly_template !== undefined) {
      await FarmerProfile.findOneAndUpdate(
        { user_id: req.user.user_id },
        { auto_apply_weekly_template },
        { upsert: true }
      );
    }

    if (Array.isArray(product_templates)) {
      for (const item of product_templates) {
        if (item.id && item.weekly_template_quantity !== undefined) {
          await Product.updateOne(
            { _id: item.id, farmer_id: req.user.user_id },
            { weekly_template_quantity: Number(item.weekly_template_quantity) || 0 }
          );
        }
      }
    }

    const products = await Product.find({ farmer_id: req.user.user_id });
    const profile = await FarmerProfile.findOne({ user_id: req.user.user_id });

    return res.json({
      success: true,
      message: 'Weekly template updated successfully',
      auto_apply_weekly_template: profile ? profile.auto_apply_weekly_template : false,
      products,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const applyWeeklyTemplate = async (req, res) => {
  try {
    const products = await Product.find({ farmer_id: req.user.user_id });

    for (const prod of products) {
      const tplQty = Number(prod.weekly_template_quantity) || 0;
      prod.quantity_available = tplQty;
      prod.is_sold_out = tplQty === 0;
      await prod.save();
    }

    const updatedProducts = await Product.find({ farmer_id: req.user.user_id }).sort({ _id: -1 });

    return res.json({
      success: true,
      message: 'Weekly template applied successfully to current stock',
      products: updatedProducts,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getOrders = async (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

const updateOrderStatus = async (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

const getInsights = async (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

const getReviews = async (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

const respondToReview = async (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

module.exports = {
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
};
