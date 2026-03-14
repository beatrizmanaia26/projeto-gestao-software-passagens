export default {
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_TRIPS(state, trips) {
    state.trips = trips
  },
  SET_CURRENT_TRIP(state, trip) {
    state.currentTrip = trip
  },
  SET_SEATS(state, seats) {
    state.seats = seats
  },
  SET_CABINS(state, cabins) {
    state.cabins = cabins
  },
  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters }
  },
  CLEAR_FILTERS(state) {
    state.filters = {
      type: null,
      origin: null,
      destination: null,
      date: null
    }
  },
  CLEAR_CURRENT_TRIP(state) {
    state.currentTrip = null
    state.seats = []
    state.cabins = []
  }
}


