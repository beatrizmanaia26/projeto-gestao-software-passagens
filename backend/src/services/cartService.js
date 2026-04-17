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

async function validateTrip(tripId) {
  const tripResult = await tripsModel.getTripById(tripId);

  if (tripResult.error) {
    throw new Error(tripResult.error.message);
  }

  if (!tripResult.data) {
    throw new Error('Viagem não encontrada');
  }

  return tripResult.data;
}

async function validateSeat(seatId) {
  if (!seatId) return;

  const seatResult = await tripsModel.getSeatById(seatId);

  if (seatResult.error) {
    throw new Error(seatResult.error.message);
  }

  if (!seatResult.data || !seatResult.data.available) {
    throw new Error('Assento indisponível');
  }
}

async function validateCabin(cabinId) {
  if (!cabinId) return;

  const cabinResult = await tripsModel.getCabinById(cabinId);

  if (cabinResult.error) {
    throw new Error(cabinResult.error.message);
  }

  if (!cabinResult.data || !cabinResult.data.available) {
    throw new Error('Cabine indisponível');
  }
}

async function updateAvailability(seatId, cabinId, available) {
  if (seatId) {
    await tripsModel.setSeatAvailability(seatId, available);
  }

  if (cabinId) {
    await tripsModel.setCabinAvailability(cabinId, available);
  }
}

async function addItemToCart({ userId, tripId, seatId, cabinId }) {
  console.log('=== CART SERVICE - ADD ITEM ===');
  console.log('Input:', { userId, tripId, seatId, cabinId });
  
  const trip = await validateTrip(tripId);
  console.log('Trip validated:', trip);

  if (trip.type === 'air' && !seatId) {
    throw new Error('Para viagem aérea, informe o seatId');
  }

  if (trip.type === 'sea' && !cabinId) {
    throw new Error('Para viagem marítima, informe o cabinId');
  }

  await validateSeat(seatId);
  console.log('Seat validated');
  
  await validateCabin(cabinId);
  console.log('Cabin validated (if applicable)');

  const cart = await getOrCreateCart(userId);
  console.log('Cart obtained:', cart);

  const result = await cartModel.addCartItem({
    cart_id: cart.id,
    trip_id: tripId,
    seat_id: seatId || null,
    cabin_id: cabinId || null
  });

  if (result.error) {
    console.error('Error adding cart item:', result.error);
    throw new Error(result.error.message);
  }

  console.log('Cart item added:', result.data);

  await updateAvailability(seatId, cabinId, false);
  console.log('Availability updated');

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
  const itemResult = await cartModel.getCartItemById(itemId);
  
  if (itemResult.error) {
    throw new Error(itemResult.error.message);
  }

  const item = itemResult.data;

  if (!item) {
    throw new Error('Item não encontrado no carrinho');
  }

  const result = await cartModel.deleteCartItem(itemId);

  if (result.error) {
    throw new Error(result.error.message);
  }

  await updateAvailability(item.seat_id, item.cabin_id, true);

  return { message: 'Item removido com sucesso', itemId };
}

module.exports = {
  addItemToCart,
  getCartByUserId,
  removeCartItem
};