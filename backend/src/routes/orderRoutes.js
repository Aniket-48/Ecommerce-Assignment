const express = require('express');
const router = express.Router();
const { placeOrder, getOrderHistory } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all order routes
router.use(authMiddleware);

// POST /api/orders
router.post('/', placeOrder);

// GET /api/orders
router.get('/', getOrderHistory);
router.get('/history', getOrderHistory); // Alias

module.exports = router;
