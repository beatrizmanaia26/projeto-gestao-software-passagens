const tripsModel = require('../models/tripsModel');

async function listTrips() {
  const result = await tripsModel.getAllTrips();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

async function getTripById(id) {
  const result = await tripsModel.getTripById(id);

  if (result.error) {
    throw new Error(result.error.message);
  }

  if (!result.data) {
    throw new Error('Viagem não encontrada');
  }

  return result.data;
}

async function getSeats(tripId) {
  const result = await tripsModel.getSeatsByTripId(tripId);

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

async function getCabins(tripId) {
  const result = await tripsModel.getCabinsByTripId(tripId);

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

module.exports = {
  listTrips,
  getTripById,
  getSeats,
  getCabins
};