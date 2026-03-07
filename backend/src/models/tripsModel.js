const supabase = require('./supabaseClient');

async function getAllTrips(filters = {}) {
  let query = supabase.from('trips').select('*');

  if (filters.type) query = query.eq('type', filters.type);
  if (filters.origin) query = query.ilike('origin', `%${filters.origin}%`);
  if (filters.destination) query = query.ilike('destination', `%${filters.destination}%`);

  return await query.order('id', { ascending: true });
}

async function getTripById(id) {
  return await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .maybeSingle();
}

async function getSeatsByTripId(tripId) {
  return await supabase
    .from('trip_seats')
    .select('*')
    .eq('trip_id', tripId)
    .order('id', { ascending: true });
}

async function getCabinsByTripId(tripId) {
  return await supabase
    .from('trip_cabins')
    .select('*')
    .eq('trip_id', tripId)
    .order('id', { ascending: true });
}

async function getSeatById(id) {
  return await supabase
    .from('trip_seats')
    .select('*')
    .eq('id', id)
    .maybeSingle();
}

async function getCabinById(id) {
  return await supabase
    .from('trip_cabins')
    .select('*')
    .eq('id', id)
    .maybeSingle();
}

async function setSeatAvailability(id, available) {
  return await supabase
    .from('trip_seats')
    .update({ available })
    .eq('id', id)
    .select()
    .single();
}

async function setCabinAvailability(id, available) {
  return await supabase
    .from('trip_cabins')
    .update({ available })
    .eq('id', id)
    .select()
    .single();
}

module.exports = {
  getAllTrips,
  getTripById,
  getSeatsByTripId,
  getCabinsByTripId,
  getSeatById,
  getCabinById,
  setSeatAvailability,
  setCabinAvailability
};