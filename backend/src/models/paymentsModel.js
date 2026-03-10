const supabase = require('./supabaseClient');

async function createPayment(paymentData) {
  return await supabase
    .from('payments')
    .insert([paymentData])
    .select()
    .single();
}

async function getPaymentsByOrderId(orderId) {
  return await supabase
    .from('payments')
    .select('*')
    .eq('order_id', orderId);
}

module.exports = {
  createPayment,
  getPaymentsByOrderId
};