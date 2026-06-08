const express = require('express');
const router = express.Router();
const { getCart, updateCart } = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all cart routes
router.use(authMiddleware);

// GET /api/cart
router.get('/', getCart);

// PUT /api/cart
router.put('/', updateCart);
router.post('/', updateCart); // POST as alias for updateCart

module.exports = router;
