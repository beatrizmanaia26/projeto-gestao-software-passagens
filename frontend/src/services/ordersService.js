import http from './http'

export default {
  checkout(userId) {
    return http.post(`/orders/checkout/${userId}`)
  },

  listByUser(userId) {
    return http.get(`/orders/user/${userId}`)
  }
}