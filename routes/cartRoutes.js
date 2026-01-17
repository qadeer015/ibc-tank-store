const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isAuthenticated } = require('../middlewares/authenticate');

// All cart routes require authentication
router.use(isAuthenticated);

// Show cart
router.get('/', cartController.showCart);

// Add to cart (form or json)
router.post('/add', cartController.addToCart);

// Update quantity
router.put('/:id', cartController.updateQuantity);

// Remove
router.delete('/:id', cartController.removeFromCart);

module.exports = router;