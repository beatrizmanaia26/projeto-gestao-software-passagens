const supabase = require('./supabaseClient');

async function createUser(userData) {
  return await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();
}

async function findUserByEmail(email) {
  return await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();
}

async function findUserByCPF(cpf) {
  return await supabase
    .from('users')
    .select('*')
    .eq('cpf', cpf)
    .maybeSingle();
}

async function findUserById(id) {
  return await supabase
    .from('users')
    .select('id, name, email, cpf')
    .eq('id', id)
    .maybeSingle();
}

async function updateUser(id, userData) {
  return await supabase
    .from('users')
    .update(userData)
    .eq('id', id)
    .select('id, name, email, cpf')
    .single();
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserByCPF,
  findUserById,
  updateUser
};