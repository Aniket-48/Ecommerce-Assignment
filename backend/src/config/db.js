const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let dbConnected = false;

// Path to local JSON DB
const JSON_DB_PATH = path.join(__dirname, '../../data/db.json');

// Ensure directory exists
const ensureJsonDb = () => {
  const dir = path.dirname(JSON_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(JSON_DB_PATH)) {
    fs.writeFileSync(
      JSON_DB_PATH,
      JSON.stringify({ users: [], products: [], carts: [], orders: [] }, null, 2)
    );
  }
};

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';
  
  try {
    console.log('Connecting to MongoDB...');
    // Connect with a 2-second timeout to fail-fast if local service is not running
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    dbConnected = true;
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.log('MongoDB connection failed. Falling back to local JSON File Database.');
    ensureJsonDb();
    dbConnected = false;
  }
};

const isConnected = () => dbConnected;

module.exports = {
  connectDB,
  isConnected,
  JSON_DB_PATH
};
