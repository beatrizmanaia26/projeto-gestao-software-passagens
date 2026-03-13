import http from './http'

export default {
  create(paymentData) {
    return http.post('/payments', paymentData)
  }
}