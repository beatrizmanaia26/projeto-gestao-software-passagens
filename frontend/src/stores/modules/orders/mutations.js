export default {
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_ORDERS(state, orders) {
    state.orders = orders
  },
  SET_CURRENT_ORDER(state, order) {
    state.currentOrder = order
  },
  ADD_ORDER(state, order) {
    state.orders.unshift(order)
  },
  CLEAR_CURRENT_ORDER(state) {
    state.currentOrder = null
  }
}


