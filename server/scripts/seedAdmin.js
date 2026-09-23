require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const mongoUri = process.env.MONGO_URI;

  if (!adminEmail || !adminPassword) {
    console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD must be defined in server/.env');
    process.exit(1);
  }

  if (!mongoUri) {
    console.error('Error: MONGO_URI must be defined in server/.env');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully.');

    const normalizedEmail = adminEmail.toLowerCase().trim();
    const existingAdmin = await User.findOne({ email: normalizedEmail });

    if (existingAdmin) {
      console.log(`Admin account already exists for ${normalizedEmail}. Updating credentials/status if needed...`);
      const saltRounds = 10;
      existingAdmin.password_hash = await bcrypt.hash(adminPassword, saltRounds);
      existingAdmin.role = 'admin';
      existingAdmin.status = 'active';
      await existingAdmin.save();
      console.log(`Admin account [${normalizedEmail}] synchronized successfully.`);
    } else {
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(adminPassword, saltRounds);

      const adminUser = new User({
        name: 'System Administrator',
        email: normalizedEmail,
        password_hash,
        role: 'admin',
        contact_number: '',
        address: 'MarketLink HQ',
        status: 'active',
      });

      await adminUser.save();
      console.log(`Admin account created successfully for: ${normalizedEmail}`);
    }

    await mongoose.disconnect();
    console.log('Database disconnected. Seed completed.');
    process.exit(0);
  } catch (error) {
    console.error('SeedAdmin error:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
};

seedAdmin();
