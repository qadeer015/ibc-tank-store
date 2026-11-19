const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/authenticate');
const paymentController = require('../controllers/paymentController');

router.use(isAuthenticated, isAdmin);
router.post('/orders/:id/payment', paymentController.recordPayment);

module.exports = router;
