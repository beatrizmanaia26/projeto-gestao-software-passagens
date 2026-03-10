const tripsService = require('../services/tripsService');

async function getAll(req, res) {
  try {
    const data = await tripsService.listTrips();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getById(req, res) {
  try {
    const data = await tripsService.getTripById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function getSeats(req, res) {
  try {
    const data = await tripsService.getSeats(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getCabins(req, res) {
  try {
    const data = await tripsService.getCabins(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getAll,
  getById,
  getSeats,
  getCabins
};