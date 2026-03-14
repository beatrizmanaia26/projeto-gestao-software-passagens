export default {
  currentPayment: (state) => state.currentPayment,
  loading: (state) => state.loading,
  error: (state) => state.error,
  paymentStatus: (state) => state.currentPayment?.payment_status || null
}


