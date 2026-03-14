import { cartAPI } from '@/services/backendAPI'

export default {
  async fetchCart({ commit, rootGetters }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const userId = rootGetters['users/userId']
      if (!userId) {
        throw new Error('Usuário não autenticado')
      }
      const response = await cartAPI.getCart(userId)
      commit('SET_ITEMS', response.data)
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao buscar carrinho'
      commit('SET_ERROR', errorMsg)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async addItem({ commit, rootGetters }, itemData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const userId = rootGetters['users/userId']
      if (!userId) {
        throw new Error('Usuário não autenticado')
      }
      const response = await cartAPI.addItem(userId, itemData)
      commit('ADD_ITEM', response.data)
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao adicionar item'
      commit('SET_ERROR', errorMsg)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async removeItem({ commit }, itemId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      await cartAPI.removeItem(itemId)
      commit('REMOVE_ITEM', itemId)
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao remover item'
      commit('SET_ERROR', errorMsg)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  clearCart({ commit }) {
    commit('CLEAR_CART')
  }
}


