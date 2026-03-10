const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/tripsController');

router.get('/', tripsController.getAll);
router.get('/:id', tripsController.getById);
router.get('/:id/seats', tripsController.getSeats);
router.get('/:id/cabins', tripsController.getCabins);

module.exports = router;