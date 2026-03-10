const cartModel = require('../models/cartModel');
const tripsModel = require('../models/tripsModel');

async function getOrCreateCart(userId) {
  const cartResult = await cartModel.findCartByUserId(userId);

  if (cartResult.error) {
    throw new Error(cartResult.error.message);
  }

  if (cartResult.data) {
    return cartResult.data;
  }

  const newCart = await cartModel.createCart(userId);

  if (newCart.error) {
    throw new Error(newCart.error.message);
  }

  return newCart.data;
}

async function addItemToCart({ userId, tripId, seatId, cabinId }) {
  const tripResult = await tripsModel.getTripById(tripId);

  if (tripResult.error) {
    throw new Error(tripResult.error.message);
  }

  if (!tripResult.data) {
    throw new Error('Viagem não encontrada');
  }

  const trip = tripResult.data;

  if (trip.type === 'air' && !seatId) {
    throw new Error('Para viagem aérea, informe o seatId');
  }

  if (trip.type === 'sea' && !cabinId) {
    throw new Error('Para viagem marítima, informe o cabinId');
  }

  if (seatId) {
    const seatResult = await tripsModel.getSeatById(seatId);

    if (seatResult.error) {
      throw new Error(seatResult.error.message);
    }

    if (!seatResult.data || !seatResult.data.available) {
      throw new Error('Assento indisponível');
    }
  }

  if (cabinId) {
    const cabinResult = await tripsModel.getCabinById(cabinId);

    if (cabinResult.error) {
      throw new Error(cabinResult.error.message);
    }

    if (!cabinResult.data || !cabinResult.data.available) {
      throw new Error('Cabine indisponível');
    }
  }

  const cart = await getOrCreateCart(userId);

  const result = await cartModel.addCartItem({
    cart_id: cart.id,
    trip_id: tripId,
    seat_id: seatId || null,
    cabin_id: cabinId || null
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

async function getCartByUserId(userId) {
  const cart = await getOrCreateCart(userId);

  const itemsResult = await cartModel.getCartItems(cart.id);

  if (itemsResult.error) {
    throw new Error(itemsResult.error.message);
  }

  return {
    cart,
    items: itemsResult.data
  };
}

async function removeCartItem(itemId) {
  const result = await cartModel.deleteCartItem(itemId);

  if (result.error) {
    throw new Error(result.error.message);
  }

  return { message: 'Item removido com sucesso' };
}

module.exports = {
  addItemToCart,
  getCartByUserId,
  removeCartItem
};