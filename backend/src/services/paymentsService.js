const paymentsModel = require('../models/paymentsModel');
const ordersModel = require('../models/ordersModel');

async function createPayment({ orderId, paymentMethod, paymentStatus, transactionId }) {
  if (!orderId || !paymentStatus) {
    throw new Error('orderId e paymentStatus são obrigatórios');
  }

  const orderResult = await ordersModel.getOrderById(orderId);

  if (orderResult.error) {
    throw new Error(orderResult.error.message);
  }

  if (!orderResult.data) {
    throw new Error('Pedido não encontrado');
  }

  const paymentResult = await paymentsModel.createPayment({
    order_id: orderId,
    payment_method: paymentMethod || null,
    payment_status: paymentStatus,
    transaction_id: transactionId || null
  });

  if (paymentResult.error) {
    throw new Error(paymentResult.error.message);
  }

  if (paymentStatus === 'approved') {
    await ordersModel.updateOrderStatus(orderId, 'paid');
  }

  return paymentResult.data;
}

module.exports = {
  createPayment
};