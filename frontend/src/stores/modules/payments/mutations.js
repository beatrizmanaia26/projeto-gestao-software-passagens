export default {
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_CURRENT_PAYMENT(state, payment) {
    state.currentPayment = payment
  },
  CLEAR_CURRENT_PAYMENT(state) {
    state.currentPayment = null
  }
}


