import { tripsAPI } from '@/services/backendAPI'

export default {
  async fetchTrips({ commit, state }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await tripsAPI.getAll(state.filters)
      commit('SET_TRIPS', response.data)
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao buscar viagens'
      commit('SET_ERROR', errorMsg)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchTripById({ commit }, tripId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await tripsAPI.getById(tripId)
      commit('SET_CURRENT_TRIP', response.data)
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao buscar viagem'
      commit('SET_ERROR', errorMsg)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchSeats({ commit }, tripId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await tripsAPI.getSeats(tripId)
      commit('SET_SEATS', response.data)
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao buscar assentos'
      commit('SET_ERROR', errorMsg)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchCabins({ commit }, tripId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await tripsAPI.getCabins(tripId)
      commit('SET_CABINS', response.data)
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao buscar cabines'
      commit('SET_ERROR', errorMsg)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  setFilters({ commit }, filters) {
    commit('SET_FILTERS', filters)
  },

  clearFilters({ commit }) {
    commit('CLEAR_FILTERS')
  },

  clearCurrentTrip({ commit }) {
    commit('CLEAR_CURRENT_TRIP')
  }
}


