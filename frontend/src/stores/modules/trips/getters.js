export default {
  trips: (state) => state.trips,
  currentTrip: (state) => state.currentTrip,
  seats: (state) => state.seats,
  cabins: (state) => state.cabins,
  loading: (state) => state.loading,
  error: (state) => state.error,
  filters: (state) => state.filters,

  // Filtrar viagens por tipo
  aerialTrips: (state) => state.trips.filter(trip => trip.type === 'air'),
  maritimeTrips: (state) => state.trips.filter(trip => trip.type === 'sea'),

  // Assentos disponíveis
  availableSeats: (state) => state.seats.filter(seat => seat.available),

  // Cabines disponíveis
  availableCabins: (state) => state.cabins.filter(cabin => cabin.available)
}


