export default {
  orders: (state) => state.orders,
  currentOrder: (state) => state.currentOrder,
  loading: (state) => state.loading,
  error: (state) => state.error,

  // Pedidos por status
  pendingOrders: (state) => state.orders.filter(order => order.status === 'pending'),
  completedOrders: (state) => state.orders.filter(order => order.status === 'completed'),
  cancelledOrders: (state) => state.orders.filter(order => order.status === 'cancelled')
}

