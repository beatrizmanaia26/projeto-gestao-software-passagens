const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

router.post('/checkout/:userId', ordersController.checkout);
router.get('/:userId', ordersController.listByUser);

module.exports = router;