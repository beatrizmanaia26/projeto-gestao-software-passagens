const supabase = require('./supabaseClient');

async function createOrder(orderData) {
  return await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();
}

async function addOrderItems(items) {
  return await supabase
    .from('order_items')
    .insert(items)
    .select();
}

async function getOrdersByUserId(userId) {
  return await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        trips (*),
        trip_seats (*),
        trip_cabins (*)
      )
    `)
    .eq('user_id', userId)
    .order('id', { ascending: false });
}

async function getOrderById(id) {
  return await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle();
}

async function updateOrderStatus(id, status) {
  return await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
}

module.exports = {
  createOrder,
  addOrderItems,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus
};