const paymentsService = require('../services/paymentsService');

async function create(req, res) {
  try {
    const data = await paymentsService.createPayment({
      orderId: req.body.orderId,
      paymentMethod: req.body.paymentMethod,
      paymentStatus: req.body.paymentStatus,
      transactionId: req.body.transactionId
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  create
};