export default {
  SET_LOADING(state, value) {
    state.loading = value
  },

  SET_ERROR(state, error) {
    state.error = error
  },

  SET_USER(state, user) {
    state.user = user
  },

  SET_TRIPS(state, trips) {
    state.trips = trips
  },

  SET_TRIP(state, trip) {
    state.trip = trip
  },

  SET_SEATS(state, seats) {
    state.seats = seats
  },

  SET_CABINS(state, cabins) {
    state.cabins = cabins
  },

  SET_CART(state, cart) {
    state.cart = cart
  },

  SET_ORDERS(state, orders) {
    state.orders = orders
  },

  ADD_ORDER(state, order) {
    state.orders.push(order)
  },

  ADD_PAYMENT(state, payment) {
    state.payments.push(payment)
  }
}