require('dotenv').config();
const { connectDB } = require('./src/config/db');
const Product = require('./src/models/Product');

const mockProducts = [
  {
    name: "Sony WH-1000XM4 Headphones",
    description: "Industry-leading noise-canceling wireless over-ear headphones with touch sensor controls and long battery life.",
    price: 299.99,
    category: "Electronics",
    image: "https://picsum.photos/id/211/600/400",
    images: [
      "https://picsum.photos/id/1/600/400"
    ],
    countInStock: 15,
    rating: 4.8,
    reviewsCount: 120,
    featured: true,
    trending: false,
    discount: 0
  },
  {
    name: "Nike Air Max 270",
    description: "Men's everyday lifestyle shoes featuring Nike's tallest Air unit yet for a super-soft ride.",
    price: 150.00,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    images: [],
    countInStock: 20,
    rating: 4.5,
    reviewsCount: 85,
    featured: false,
    trending: true,
    discount: 0
  },
  {
    name: "Apple MacBook Air M2",
    description: "Strikingly thin design, 13.6-inch Liquid Retina display, 8GB RAM, 256GB SSD storage.",
    price: 1099.00,
    category: "Electronics",
    image: "https://picsum.photos/id/0/600/400",
    images: [
      "https://picsum.photos/id/180/600/400"
    ],
    countInStock: 8,
    rating: 4.9,
    reviewsCount: 340,
    featured: true,
    trending: false,
    discount: 0
  },
  {
    name: "Hydro Flask 32 oz Wide Mouth",
    description: "Stainless steel insulated water bottle with leakproof cap, keeps drinks cold for 24 hours.",
    price: 44.95,
    category: "Fitness & Outdoors",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600",
    images: [],
    countInStock: 45,
    rating: 4.7,
    reviewsCount: 512,
    trending: true,
    featured: false,
    discount: 0
  },
  {
    name: "Minimalist Leather Wallet",
    description: "Slim RFID-blocking front pocket wallet crafted from premium full-grain leather.",
    price: 35.00,
    category: "Accessories",
    image: "https://picsum.photos/id/435/600/400",
    images: [],
    countInStock: 0,
    rating: 4.3,
    reviewsCount: 64,
    featured: false,
    trending: false,
    discount: 0
  },
  {
    name: "Ergonomic Mechanical Keyboard",
    description: "Wireless RGB mechanical keyboard with hot-swappable switches and aluminum frame.",
    price: 129.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600",
    images: [],
    countInStock: 12,
    rating: 4.6,
    reviewsCount: 195,
    trending: true,
    featured: false,
    discount: 0
  }
];

const seed = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await connectDB();
    
    const { isConnected } = require('./src/config/db');
    
    if (isConnected()) {
      console.log('Connected to MongoDB. Clearing products collection...');
      const mongoose = require('mongoose');
      // Ensure the model is loaded
      const MongoProduct = mongoose.model('Product');
      await MongoProduct.deleteMany({});
      
      console.log(`Seeding ${mockProducts.length} products to MongoDB...`);
      await Product.insertMany(mockProducts);
      console.log('MongoDB database seeded successfully!');
    } else {
      console.log('Using local JSON DB. Clearing and seeding...');
      const fs = require('fs');
      const { JSON_DB_PATH } = require('./src/config/db');
      if (fs.existsSync(JSON_DB_PATH)) {
        const dbData = JSON.parse(fs.readFileSync(JSON_DB_PATH, 'utf8'));
        dbData.products = mockProducts.map((p, idx) => ({
          _id: `p${idx + 1}_manual`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...p
        }));
        fs.writeFileSync(JSON_DB_PATH, JSON.stringify(dbData, null, 2));
        console.log('Local JSON DB seeded successfully!');
      }
    }
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
