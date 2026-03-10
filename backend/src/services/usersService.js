const bcrypt = require('bcryptjs');
const usersModel = require('../models/usersModel');

async function registerUser({ name, email, password, cpf }) {
  if (!name || !email || !password || !cpf) {
    throw new Error('Preencha todos os campos');
  }

  const existingUser = await usersModel.findUserByEmail(email);

  if (existingUser.error) {
    throw new Error(existingUser.error.message);
  }

  if (existingUser.data) {
    throw new Error('Email já cadastrado');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await usersModel.createUser({
    name,
    email,
    password: hashedPassword,
    cpf
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error('Email e senha são obrigatórios');
  }

  const result = await usersModel.findUserByEmail(email);

  if (result.error) {
    throw new Error(result.error.message);
  }

  if (!result.data) {
    throw new Error('Usuário não encontrado');
  }

  const validPassword = await bcrypt.compare(password, result.data.password);

  if (!validPassword) {
    throw new Error('Senha inválida');
  }

  return {
    id: result.data.id,
    name: result.data.name,
    email: result.data.email,
    cpf: result.data.cpf
  };
}

async function getUserById(id) {
  const result = await usersModel.findUserById(id);

  if (result.error) {
    throw new Error(result.error.message);
  }

  if (!result.data) {
    throw new Error('Usuário não encontrado');
  }

  return result.data;
}

module.exports = {
  registerUser,
  loginUser,
  getUserById
};