const ordersService = require('../services/ordersService');

async function checkout(req, res) {
  try {
    const data = await ordersService.checkout(req.params.userId);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function listByUser(req, res) {
  try {
    const data = await ordersService.listOrdersByUser(req.params.userId);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  checkout,
  listByUser
};