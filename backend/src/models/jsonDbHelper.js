const fs = require('fs');
const { JSON_DB_PATH } = require('../config/db');

// Read the database file
const readData = () => {
  try {
    const data = fs.readFileSync(JSON_DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [], products: [], carts: [], orders: [] };
  }
};

// Write to the database file
const writeData = (data) => {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
};

// Generates a mock ObjectID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Base operations helper
const getCollection = (collectionName) => {
  return {
    find: (filter = {}) => {
      const data = readData();
      let items = data[collectionName] || [];

      // Filter processing
      const results = items.filter(item => {
        for (let key in filter) {
          if (filter[key] && typeof filter[key] === 'object' && filter[key].$in) {
            // Support Mongoose's $in operator (e.g. { category: { $in: ['electronics'] } })
            if (!filter[key].$in.includes(item[key])) return false;
          } else if (item[key] !== filter[key]) {
            return false;
          }
        }
        return true;
      });
      return results.map(doc => wrapDocument(collectionName, doc));
    },

    findOne: (filter = {}) => {
      const items = getCollection(collectionName).find(filter);
      return items.length > 0 ? items[0] : null;
    },

    findById: (id) => {
      return getCollection(collectionName).findOne({ _id: id });
    },

    create: (doc) => {
      const data = readData();
      if (!data[collectionName]) data[collectionName] = [];

      const newDoc = {
        _id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...doc
      };

      data[collectionName].push(newDoc);
      writeData(data);
      return wrapDocument(collectionName, newDoc);
    },

    insertMany: (docs) => {
      const data = readData();
      if (!data[collectionName]) data[collectionName] = [];

      const newDocs = docs.map(doc => ({
        _id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...doc
      }));

      data[collectionName].push(...newDocs);
      writeData(data);
      return newDocs.map(doc => wrapDocument(collectionName, doc));
    },

    countDocuments: (filter = {}) => {
      return getCollection(collectionName).find(filter).length;
    },

    findOneAndUpdate: (filter, update, options = {}) => {
      const data = readData();
      const items = data[collectionName] || [];
      const index = items.findIndex(item => {
        for (let key in filter) {
          if (item[key] !== filter[key]) return false;
        }
        return true;
      });

      if (index === -1) {
        if (options.upsert) {
          // Perform insert
          const newDoc = {
            _id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...filter,
            ...(update.$set || update)
          };
          items.push(newDoc);
          data[collectionName] = items;
          writeData(data);
          return wrapDocument(collectionName, newDoc);
        }
        return null;
      }

      // Update fields
      const updatedFields = update.$set || update;
      items[index] = {
        ...items[index],
        ...updatedFields,
        updatedAt: new Date().toISOString()
      };

      data[collectionName] = items;
      writeData(data);
      return wrapDocument(collectionName, items[index]);
    }
  };
};

// Helper to add MongoDB-like .save() function to document objects
const wrapDocument = (collectionName, doc) => {
  if (!doc) return null;
  
  // Clone doc to avoid mutability side-effects
  const wrapped = JSON.parse(JSON.stringify(doc));

  Object.defineProperty(wrapped, 'save', {
    enumerable: false,
    value: async function () {
      const data = readData();
      const items = data[collectionName] || [];
      const index = items.findIndex(item => item._id === this._id);

      this.updatedAt = new Date().toISOString();

      if (index !== -1) {
        items[index] = { ...this };
      } else {
        items.push({ ...this });
      }

      data[collectionName] = items;
      writeData(data);
      return this;
    }
  });

  return wrapped;
};

module.exports = {
  getCollection,
  wrapDocument
};
