const cartService = require('../services/cartService');

async function addItem(req, res) {
  try {
    const data = await cartService.addItemToCart({
      userId: req.params.userId,
      tripId: req.body.tripId,
      seatId: req.body.seatId,
      cabinId: req.body.cabinId
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getCart(req, res) {
  try {
    const data = await cartService.getCartByUserId(req.params.userId);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function removeItem(req, res) {
  try {
    const data = await cartService.removeCartItem(req.params.itemId);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  addItem,
  getCart,
  removeItem
};