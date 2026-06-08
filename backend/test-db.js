const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

// Force using Google Public DNS to bypass local ISP DNS SRV resolution block
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const test = async () => {
  const uri = process.env.MONGODB_URI;
  console.log('Testing connection with custom DNS resolver to:', uri);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Successfully connected!');
    process.exit(0);
  } catch (err) {
    console.error('Connection failed with error:');
    console.error(err);
    process.exit(1);
  }
};

test();
