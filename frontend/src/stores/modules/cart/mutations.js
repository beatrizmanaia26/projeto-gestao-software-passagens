export default {
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_ITEMS(state, items) {
    state.items = items
  },
  ADD_ITEM(state, item) {
    state.items.push(item)
  },
  REMOVE_ITEM(state, itemId) {
    state.items = state.items.filter(item => item.id !== itemId)
  },
  CLEAR_CART(state) {
    state.items = []
  }
}


