export default {
  items: (state) => state.items,
  loading: (state) => state.loading,
  error: (state) => state.error,

  // Total de itens no carrinho
  itemCount: (state) => state.items.length,

  // Total do carrinho
  totalAmount: (state) => {
    return state.items.reduce((total, item) => {
      return total + (item.unit_price * item.quantity)
    }, 0)
  },

  // Verificar se carrinho está vazio
  isEmpty: (state) => state.items.length === 0
}


