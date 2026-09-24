const mongoose = require('mongoose');
const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const Product = require('../models/Product');
const bcrypt = require('bcrypt');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://funterboy495_db_user:r4fNE1xm7kkbSJ6P@marketlink-cluster.mkepivo.mongodb.net/marketlink?appName=marketlink-cluster';

const seedFarmerData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding farmer data...');

    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash('farmerPassword123', salt);

    // 1. Seed Active Approved Farmer
    let activeFarmer = await User.findOne({ email: 'farmer.active@marketlink.local' });
    if (!activeFarmer) {
      activeFarmer = await User.create({
        name: 'Greenfield Valley Farm',
        email: 'farmer.active@marketlink.local',
        password_hash: passHash,
        role: 'farmer',
        status: 'active',
        contact_number: '+1 (555) 234-5678',
        address: '742 Evergreen Terrace, Greenfield',
        stall_name: 'Greenfield Harvest Stall',
      });
      console.log('Created active farmer: farmer.active@marketlink.local / farmerPassword123');
    }

    let activeProfile = await FarmerProfile.findOne({ user_id: activeFarmer._id });
    if (!activeProfile) {
      activeProfile = await FarmerProfile.create({
        user_id: activeFarmer._id,
        stall_name: 'Greenfield Harvest Stall',
        operating_days: ['Saturday', 'Sunday'],
        pickup_windows: 'Saturdays 8:00 AM - 1:00 PM',
        latitude: 37.7749,
        longitude: -122.4194,
        auto_apply_weekly_template: true,
      });
      console.log('Created active farmer profile');
    }

    // Seed products for active farmer
    const existingProducts = await Product.find({ farmer_id: activeFarmer._id });
    if (existingProducts.length === 0) {
      await Product.create([
        {
          farmer_id: activeFarmer._id,
          name: 'Fresh Organic Carrots',
          category: 'Vegetables',
          price: 3.49,
          unit: 'bunch',
          quantity_available: 25,
          weekly_template_quantity: 30,
          description: 'Sweet, crisp orange carrots freshly harvested.',
          image_url: 'https://images.unsplash.com/photo-1598170845058-12ef4a457939?w=300&q=80',
          is_sold_out: false,
        },
        {
          farmer_id: activeFarmer._id,
          name: 'Farm Fresh Brown Eggs',
          category: 'Dairy & Eggs',
          price: 5.99,
          unit: 'dozen',
          quantity_available: 15,
          weekly_template_quantity: 20,
          description: 'Pasture-raised hen eggs with bright yellow yolks.',
          image_url: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=300&q=80',
          is_sold_out: false,
        },
        {
          farmer_id: activeFarmer._id,
          name: 'Heirloom Strawberries',
          category: 'Fruits',
          price: 4.50,
          unit: 'pint',
          quantity_available: 0,
          weekly_template_quantity: 15,
          description: 'Juicy, naturally sweet red berries.',
          image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&q=80',
          is_sold_out: true,
        },
      ]);
      console.log('Seeded 3 sample products for active farmer');
    }

    // 2. Seed Pending Farmer (Awaiting Admin Approval)
    let pendingFarmer = await User.findOne({ email: 'farmer.pending@marketlink.local' });
    if (!pendingFarmer) {
      pendingFarmer = await User.create({
        name: 'Sunny Acres Orchards',
        email: 'farmer.pending@marketlink.local',
        password_hash: passHash,
        role: 'farmer',
        status: 'pending',
        contact_number: '+1 (555) 987-6543',
        address: '101 Apple Lane, Sunnyvale',
        stall_name: 'Sunny Acres Stall',
      });
      console.log('Created pending farmer: farmer.pending@marketlink.local / farmerPassword123');
    }

    let pendingProfile = await FarmerProfile.findOne({ user_id: pendingFarmer._id });
    if (!pendingProfile) {
      await FarmerProfile.create({
        user_id: pendingFarmer._id,
        stall_name: 'Sunny Acres Stall',
        operating_days: ['Sunday'],
        pickup_windows: 'Sundays 9:00 AM - 2:00 PM',
      });
      console.log('Created pending farmer profile');
    }

    console.log('\n--- FARMER SEED DATA READY ---');
    console.log('Approved Farmer: farmer.active@marketlink.local / farmerPassword123');
    console.log('Pending Farmer:  farmer.pending@marketlink.local / farmerPassword123');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedFarmerData();
