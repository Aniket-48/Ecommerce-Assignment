const mongoose = require('mongoose');
const { isConnected } = require('../config/db');
const { getCollection } = require('./jsonDbHelper');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  image: { type: String, required: true },
  images: [{ type: String }],
  countInStock: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const MongoProduct = mongoose.model('Product', productSchema);
const jsonCollection = getCollection('products');

const Product = {
  find: async (filter = {}) => {
    if (isConnected()) {
      return await MongoProduct.find(filter);
    }
    return jsonCollection.find(filter);
  },

  findOne: async (filter) => {
    if (isConnected()) {
      return await MongoProduct.findOne(filter);
    }
    return jsonCollection.findOne(filter);
  },

  findById: async (id) => {
    if (isConnected()) {
      return await MongoProduct.findById(id);
    }
    return jsonCollection.findById(id);
  },

  create: async (productData) => {
    if (isConnected()) {
      return await MongoProduct.create(productData);
    }
    return jsonCollection.create(productData);
  },

  insertMany: async (products) => {
    if (isConnected()) {
      return await MongoProduct.insertMany(products);
    }
    return jsonCollection.insertMany(products);
  },

  countDocuments: async (filter = {}) => {
    if (isConnected()) {
      return await MongoProduct.countDocuments(filter);
    }
    return jsonCollection.countDocuments(filter);
  }
};

module.exports = Product;
