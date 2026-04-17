const usersModel = require('../models/usersModel');

async function registerUser({ name, email, password, cpf }) {
  if (!name || !email || !password || !cpf) {
    throw new Error('Preencha todos os campos');
  }

  // Verificar se o email já existe
  const existingUser = await usersModel.findUserByEmail(email);

  if (existingUser.error) {
    throw new Error(existingUser.error.message);
  }

  if (existingUser.data) {
    throw new Error('Email já cadastrado');
  }

  // Verificar se o CPF já existe
  const existingCPF = await usersModel.findUserByCPF(cpf);

  if (existingCPF.error) {
    throw new Error(existingCPF.error.message);
  }

  if (existingCPF.data) {
    throw new Error('CPF já cadastrado');
  }

  // Salva a senha como texto simples (SEM hash)
  const result = await usersModel.createUser({
    name,
    email,
    password: password, // Senha sem criptografia
    cpf
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return {
    user: result.data,
    token: 'fake-token-' + result.data.id // Token fake para desenvolvimento
  };
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

  // Compara senha como texto simples (SEM hash)
  if (password !== result.data.password) {
    throw new Error('Senha inválida');
  }

  return {
    user: {
      id: result.data.id,
      name: result.data.name,
      email: result.data.email,
      cpf: result.data.cpf
    },
    token: 'fake-token-' + result.data.id // Token fake para desenvolvimento
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

async function updateUser(id, { name, email }) {
  if (!name && !email) {
    throw new Error('Forneça pelo menos um campo para atualizar');
  }

  // Verificar se o usuário existe
  const userExists = await usersModel.findUserById(id);
  if (userExists.error || !userExists.data) {
    throw new Error('Usuário não encontrado');
  }

  // Se está alterando o email, verificar se já não existe outro usuário com esse email
  if (email && email !== userExists.data.email) {
    const emailExists = await usersModel.findUserByEmail(email);
    if (emailExists.data && emailExists.data.id !== id) {
      throw new Error('Email já está em uso por outro usuário');
    }
  }

  // Atualizar apenas os campos fornecidos
  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;

  const result = await usersModel.updateUser(id, updateData);

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUser
};