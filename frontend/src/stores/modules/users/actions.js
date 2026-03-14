import { usersAPI } from '@/services/backendAPI'

export default {
  async register({ commit }, userData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await usersAPI.register(userData)
      const { user, token } = response.data
      commit('SET_CURRENT_USER', user)
      commit('SET_TOKEN', token)
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao registrar usuário'
      commit('SET_ERROR', errorMsg)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async login({ commit }, credentials) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await usersAPI.login(credentials)
      const { user, token } = response.data
      commit('SET_CURRENT_USER', user)
      commit('SET_TOKEN', token)
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao fazer login'
      commit('SET_ERROR', errorMsg)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchUserById({ commit }, userId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await usersAPI.getById(userId)
      commit('SET_CURRENT_USER', response.data)
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao buscar usuário'
      commit('SET_ERROR', errorMsg)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateUser({ commit }, userData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await usersAPI.update(userData.id, {
        name: userData.name,
        email: userData.email
      })
      commit('SET_CURRENT_USER', response.data)
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao atualizar usuário'
      commit('SET_ERROR', errorMsg)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  logout({ commit }) {
    commit('LOGOUT')
  }
}

// Made with Bob
