const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.showCheckout);
router.post('/', orderController.createOrder);
router.get('/success/:orderNumber', orderController.orderSuccess);

module.exports = router;
