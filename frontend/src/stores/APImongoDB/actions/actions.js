import usersService from '@/services/usersService'
import tripsService from '@/services/tripsService'
import cartService from '@/services/cartService'
import ordersService from '@/services/ordersService'
import paymentsService from '@/services/paymentsService'

export default {
  async registerUser({ commit }, userData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await usersService.register(userData)
      commit('SET_USER', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data || error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async loginUser({ commit }, loginData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await usersService.login(loginData)

      commit('SET_USER', response.data.user || response.data)

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }

      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data || error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchUserById({ commit }, userId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await usersService.getById(userId)
      commit('SET_USER', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data || error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchTrips({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await tripsService.getAll()
      commit('SET_TRIPS', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data || error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchTripById({ commit }, tripId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await tripsService.getById(tripId)
      commit('SET_TRIP', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data || error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchSeats({ commit }, tripId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await tripsService.getSeats(tripId)
      commit('SET_SEATS', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data || error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchCabins({ commit }, tripId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await tripsService.getCabins(tripId)
      commit('SET_CABINS', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data || error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchCart({ commit }, userId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await cartService.getCart(userId)
      commit('SET_CART', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data || error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async addToCart({ dispatch, commit }, { userId, itemData }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await cartService.addItem(userId, itemData)
      await dispatch('fetchCart', userId)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data || error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async removeFromCart({ dispatch, commit }, { itemId, userId }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await cartService.removeItem(itemId)
      await dispatch('fetchCart', userId)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data || error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async checkout({ commit }, userId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await ordersService.checkout(userId)
      commit('ADD_ORDER', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data || error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchOrdersByUser({ commit }, userId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await ordersService.listByUser(userId)
      commit('SET_ORDERS', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data || error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createPayment({ commit }, paymentData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await paymentsService.create(paymentData)
      commit('ADD_PAYMENT', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data || error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}