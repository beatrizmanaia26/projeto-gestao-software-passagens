const cartService = require('../services/cartService');

async function addItem(req, res) {
  try {
    console.log('=== ADD ITEM TO CART ===');
    console.log('User ID:', req.params.userId);
    console.log('Request Body:', req.body);
    
    const data = await cartService.addItemToCart({
      userId: req.params.userId,
      tripId: req.body.tripId || req.body.trip_id,
      seatId: req.body.seatId || req.body.seat_id,
      cabinId: req.body.cabinId || req.body.cabin_id
    });

    console.log('Item added successfully:', data);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error adding item to cart:', error.message);
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