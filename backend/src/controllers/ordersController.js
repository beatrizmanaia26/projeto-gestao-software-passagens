const ordersService = require('../services/ordersService');

async function getOrdersByUserId(req, res) {
  try {
    const { userId } = req.params;

    const data = await ordersService.getOrdersByUserId(userId);

    res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao buscar pedidos do usuário:', error);

    res.status(400).json({
      error: error.message
    });
  }
}

module.exports = {
  getOrdersByUserId
};