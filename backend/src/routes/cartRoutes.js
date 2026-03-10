const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/:userId/add', cartController.addItem);
router.get('/:userId', cartController.getCart);
router.delete('/item/:itemId', cartController.removeItem);

module.exports = router;