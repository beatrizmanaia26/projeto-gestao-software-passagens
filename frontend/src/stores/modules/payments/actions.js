import { paymentsAPI } from '@/services/backendAPI'

export default {
  async processPayment({ commit }, paymentData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await paymentsAPI.process(paymentData)
      commit('SET_CURRENT_PAYMENT', response.data)
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao processar pagamento'
      commit('SET_ERROR', errorMsg)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchPaymentByOrder({ commit }, orderId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await paymentsAPI.getByOrder(orderId)
      commit('SET_CURRENT_PAYMENT', response.data)
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao buscar pagamento'
      commit('SET_ERROR', errorMsg)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  clearCurrentPayment({ commit }) {
    commit('CLEAR_CURRENT_PAYMENT')
  }
}


