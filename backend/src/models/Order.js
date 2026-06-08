const mongoose = require('mongoose');
const { isConnected } = require('../config/db');
const { getCollection } = require('./jsonDbHelper');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true }
    }
  ],
  shippingAddress: {
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  paymentMethod: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Processing' },
  createdAt: { type: Date, default: Date.now }
});

const MongoOrder = mongoose.model('Order', orderSchema);
const jsonCollection = getCollection('orders');

const Order = {
  find: async (filter = {}) => {
    if (isConnected()) {
      return await MongoOrder.find(filter).sort({ createdAt: -1 });
    }
    // Sort orders by createdAt descending manually for JSON fallback
    const items = jsonCollection.find(filter);
    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  create: async (orderData) => {
    if (isConnected()) {
      return await MongoOrder.create(orderData);
    }
    return jsonCollection.create(orderData);
  }
};

module.exports = Order;
