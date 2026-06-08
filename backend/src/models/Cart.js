const mongoose = require('mongoose');
const { isConnected } = require('../config/db');
const { getCollection } = require('./jsonDbHelper');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 }
    }
  ],
  updatedAt: { type: Date, default: Date.now }
});

const MongoCart = mongoose.model('Cart', cartSchema);
const jsonCollection = getCollection('carts');

const Cart = {
  findOne: async (filter) => {
    if (isConnected()) {
      return await MongoCart.findOne(filter);
    }
    return jsonCollection.findOne(filter);
  },

  create: async (cartData) => {
    if (isConnected()) {
      return await MongoCart.create(cartData);
    }
    return jsonCollection.create(cartData);
  },

  findOneAndUpdate: async (filter, update, options = {}) => {
    if (isConnected()) {
      return await MongoCart.findOneAndUpdate(filter, update, options);
    }
    return jsonCollection.findOneAndUpdate(filter, update, options);
  }
};

module.exports = Cart;
