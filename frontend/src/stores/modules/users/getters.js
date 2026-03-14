export default {
  currentUser: (state) => state.currentUser,
  isAuthenticated: (state) => state.isAuthenticated,
  token: (state) => state.token,
  loading: (state) => state.loading,
  error: (state) => state.error,
  userId: (state) => state.currentUser?.id || null,
  userName: (state) => state.currentUser?.name || '',
  userEmail: (state) => state.currentUser?.email || ''
}


