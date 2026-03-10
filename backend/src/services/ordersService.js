const cartModel = require('../models/cartModel');
const ordersModel = require('../models/ordersModel');
const tripsModel = require('../models/tripsModel');

async function checkout(userId) {
  const cartResult = await cartModel.findCartByUserId(userId);

  if (cartResult.error) {
    throw new Error(cartResult.error.message);
  }

  if (!cartResult.data) {
    throw new Error('Carrinho não encontrado');
  }

  const cart = cartResult.data;

  const itemsResult = await cartModel.getCartItems(cart.id);

  if (itemsResult.error) {
    throw new Error(itemsResult.error.message);
  }

  const items = itemsResult.data;

  if (!items.length) {
    throw new Error('Carrinho vazio');
  }

  let totalAmount = 0;

  for (const item of items) {
    totalAmount += Number(item.trips.price);
  }

  const orderResult = await ordersModel.createOrder({
    user_id: userId,
    total_amount: totalAmount,
    status: 'pending'
  });

  if (orderResult.error) {
    throw new Error(orderResult.error.message);
  }

  const order = orderResult.data;

  const orderItems = items.map((item) => ({
    order_id: order.id,
    trip_id: item.trip_id,
    seat_id: item.seat_id,
    cabin_id: item.cabin_id,
    unit_price: item.trips.price
  }));

  const createItemsResult = await ordersModel.addOrderItems(orderItems);

  if (createItemsResult.error) {
    throw new Error(createItemsResult.error.message);
  }

  for (const item of items) {
    if (item.seat_id) {
      await tripsModel.setSeatAvailability(item.seat_id, false);
    }

    if (item.cabin_id) {
      await tripsModel.setCabinAvailability(item.cabin_id, false);
    }
  }

  await cartModel.clearCart(cart.id);

  return {
    order,
    items: createItemsResult.data
  };
}

async function listOrdersByUser(userId) {
  const result = await ordersModel.getOrdersByUserId(userId);

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

module.exports = {
  checkout,
  listOrdersByUser
};