const supabase = require('../models/supabaseClient');

async function getOrdersByUserId(userId) {
  if (!userId) {
    throw new Error('userId é obrigatório');
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      user_id,
      total_amount,
      status,
      order_items (
        id,
        trip_id,
        seat_id,
        cabin_id,
        unit_price,
        trips (
          id,
          origin,
          destination,
          type,
          price
        ),
        trip_seats (
          id,
          seat_number,
          class
        ),
        trip_cabins (
          id,
          cabin_number,
          cabin_type
        )
      ),
      payments (
        id,
        payment_method,
        payment_status,
        transaction_id
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'approved')
    .order('id', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

module.exports = {
  getOrdersByUserId
};