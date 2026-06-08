const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    // Populate items manually (consistent results across Mongo/JSON fallback databases)
    const populatedItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        populatedItems.push({
          product: {
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            countInStock: product.countInStock
          },
          productId: product._id.toString(),
          quantity: item.quantity
        });
      }
    }

    res.json({
      _id: cart._id,
      userId: cart.userId,
      items: populatedItems
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error while fetching cart.' });
  }
};

const updateCart = async (req, res) => {
  const userId = req.user.id;
  const { items } = req.body; // Expects array of { productId, quantity }

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Invalid cart items format.' });
  }

  try {
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    // Assign items and clean up duplicates
    cart.items = items
      .filter(item => item.productId && item.quantity > 0)
      .map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

    await cart.save();

    // Re-populate and return the fresh state
    const populatedItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        populatedItems.push({
          product: {
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            countInStock: product.countInStock
          },
          productId: product._id.toString(),
          quantity: item.quantity
        });
      }
    }

    res.json({
      _id: cart._id,
      userId: cart.userId,
      items: populatedItems
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Server error while updating cart.' });
  }
};

module.exports = {
  getCart,
  updateCart
};
