import http from './http'

export default {
  addItem(userId, itemData) {
    return http.post(`/cart/${userId}`, itemData)
  },

  getCart(userId) {
    return http.get(`/cart/${userId}`)
  },

  removeItem(itemId) {
    return http.delete(`/cart/${itemId}`)
  }
}