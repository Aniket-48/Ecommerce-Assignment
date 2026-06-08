const Order = require('../models/Order');
const Cart = require('../models/Cart');

const placeOrder = async (req, res) => {
  const userId = req.user.id;
  const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Cart items are required to place an order.' });
  }

  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
    return res.status(400).json({ message: 'Full shipping address is required.' });
  }

  if (!paymentMethod) {
    return res.status(400).json({ message: 'Payment method is required.' });
  }

  if (totalAmount === undefined || totalAmount === null) {
    return res.status(400).json({ message: 'Total amount is required.' });
  }

  try {
    // Create new order record
    const newOrder = await Order.create({
      userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: 'Processing'
    });

    // Clear active cart upon successful order placement
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Server error while placing order.' });
  }
};

const getOrderHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error while fetching order history.' });
  }
};

module.exports = {
  placeOrder,
  getOrderHistory
};
