import { createStore } from 'vuex'
import users from './modules/users'
import trips from './modules/trips'
import cart from './modules/cart'
import orders from './modules/orders'
import payments from './modules/payments'

const store = createStore({
  modules: {
    users,
    trips,
    cart,
    orders,
    payments
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store


