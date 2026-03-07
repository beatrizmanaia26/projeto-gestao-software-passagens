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

async function findUserById(id) {
  return await supabase
    .from('users')
    .select('id, name, email, cpf')
    .eq('id', id)
    .maybeSingle();
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};