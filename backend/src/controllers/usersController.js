const usersService = require('../services/usersService');

async function register(req, res) {
  try {
    const data = await usersService.registerUser(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const data = await usersService.loginUser(req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getById(req, res) {
  try {
    const data = await usersService.getUserById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function update(req, res) {
  try {
    const data = await usersService.updateUser(req.params.id, req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  register,
  login,
  getById,
  update
};