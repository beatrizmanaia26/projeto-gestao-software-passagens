const supabase = require('./supabaseClient');

async function findCartByUserId(userId) {
  return await supabase
    .from('carts')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
}

async function createCart(userId) {
  return await supabase
    .from('carts')
    .insert([{ user_id: userId }])
    .select()
    .single();
}

async function addCartItem(itemData) {
  return await supabase
    .from('cart_items')
    .insert([itemData])
    .select()
    .single();
}

async function getCartItems(cartId) {
  return await supabase
    .from('cart_items')
    .select(`
      *,
      trips (*),
      trip_seats (*),
      trip_cabins (*)
    `)
    .eq('cart_id', cartId);
}

async function deleteCartItem(itemId) {
  return await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);
}

async function clearCart(cartId) {
  return await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cartId);
}

module.exports = {
  findCartByUserId,
  createCart,
  addCartItem,
  getCartItems,
  deleteCartItem,
  clearCart
};