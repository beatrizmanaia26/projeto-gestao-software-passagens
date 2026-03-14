import { ordersAPI } from '@/services/backendAPI'

export default {
  async createOrder({ commit, rootGetters }, orderData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const userId = rootGetters['users/userId']
      if (!userId) {
        throw new Error('Usuário não autenticado')
      }
      const response = await ordersAPI.create({ ...orderData, user_id: userId })
      commit('ADD_ORDER', response.data)
      commit('SET_CURRENT_ORDER', response.data)
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao criar pedido'
      commit('SET_ERROR', errorMsg)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchOrderById({ commit }, orderId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await ordersAPI.getById(orderId)
      commit('SET_CURRENT_ORDER', response.data)
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao buscar pedido'
      commit('SET_ERROR', errorMsg)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchUserOrders({ commit, rootGetters }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const userId = rootGetters['users/userId']
      if (!userId) {
        throw new Error('Usuário não autenticado')
      }
      const response = await ordersAPI.getByUser(userId)
      commit('SET_ORDERS', response.data)
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao buscar pedidos'
      commit('SET_ERROR', errorMsg)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  clearCurrentOrder({ commit }) {
    commit('CLEAR_CURRENT_ORDER')
  }
}


