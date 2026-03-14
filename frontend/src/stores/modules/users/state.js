export default () => ({
  currentUser: null,
  isAuthenticated: false,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null
})

// Made with Bob
