import http from './http'

// ============= USERS =============
export const usersAPI = {
  register(userData) {
    return http.post('/users/register', userData)
  },
  login(credentials) {
    return http.post('/users/login', credentials)
  },
  getById(userId) {
    return http.get(`/users/${userId}`)
  },
  update(userId, userData) {
    return http.put(`/users/${userId}`, userData)
  }
}

// ============= TRIPS =============
export const tripsAPI = {
  getAll(filters = {}) {
    return http.get('/trips', { params: filters })
  },
  getById(tripId) {
    return http.get(`/trips/${tripId}`)
  },
  getSeats(tripId) {
    return http.get(`/trips/${tripId}/seats`)
  },
  getCabins(tripId) {
    return http.get(`/trips/${tripId}/cabins`)
  }
}

// ============= CART =============
export const cartAPI = {
  addItem(userId, itemData) {
    return http.post(`/cart/${userId}/add`, itemData)
  },
  getCart(userId) {
    return http.get(`/cart/${userId}`)
  },
  removeItem(itemId) {
    return http.delete(`/cart/item/${itemId}`)
  }
}

// ============= ORDERS =============
export const ordersAPI = {
  create(orderData) {
    return http.post('/orders', orderData)
  },
  getById(orderId) {
    return http.get(`/orders/${orderId}`)
  },
  getByUser(userId) {
    return http.get(`/orders/user/${userId}`)
  }
}

// ============= PAYMENTS =============
export const paymentsAPI = {
  process(paymentData) {
    return http.post('/payments/process', paymentData)
  },
  getByOrder(orderId) {
    return http.get(`/payments/order/${orderId}`)
  }
}

// Made with Bob
