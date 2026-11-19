const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.showCart);
router.post('/add', cartController.addToCart);
router.post('/:id/quantity', cartController.updateQuantity);
router.post('/:id/remove', cartController.removeFromCart);

module.exports = router;
