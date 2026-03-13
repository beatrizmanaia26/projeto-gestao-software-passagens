import http from './http'

export default {
  getAll() {
    return http.get('/trips')
  },

  getById(id) {
    return http.get(`/trips/${id}`)
  },

  getSeats(id) {
    return http.get(`/trips/${id}/seats`)
  },

  getCabins(id) {
    return http.get(`/trips/${id}/cabins`)
  }
}