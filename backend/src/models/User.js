const mongoose = require('mongoose');
const { isConnected } = require('../config/db');
const { getCollection } = require('./jsonDbHelper');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const MongoUser = mongoose.model('User', userSchema);
const jsonCollection = getCollection('users');

const User = {
  findOne: async (filter) => {
    if (isConnected()) {
      return await MongoUser.findOne(filter);
    }
    return jsonCollection.findOne(filter);
  },

  findById: async (id) => {
    if (isConnected()) {
      return await MongoUser.findById(id);
    }
    return jsonCollection.findById(id);
  },

  create: async (userData) => {
    if (isConnected()) {
      return await MongoUser.create(userData);
    }
    return jsonCollection.create(userData);
  }
};

module.exports = User;
