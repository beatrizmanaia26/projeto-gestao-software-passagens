import http from './http'

export default {
  register(userData) {
    return http.post('/users/register', userData)
  },

  login(loginData) {
    return http.post('/users/login', loginData)
  },

  getById(userId) {
    return http.get(`/users/${userId}`)
  }
}