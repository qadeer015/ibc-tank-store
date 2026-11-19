const express = require('express');
const router = express.Router();
const buyNowController = require('../controllers/buyNowController');

router.post('/', buyNowController.start);
router.get('/', buyNowController.show);
router.post('/place', buyNowController.place);

module.exports = router;
