const express = require('express')
const cors = require('cors')

const usersRoutes = require('./src/routes/usersRoutes')
const tripsRoutes = require('./src/routes/tripsRoutes')
const cartRoutes = require('./src/routes/cartRoutes')
const ordersRoutes = require('./src/routes/ordersRoutes')
const paymentsRoutes = require('./src/routes/paymentsRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', usersRoutes)
app.use('/api/trips', tripsRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/payments', paymentsRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})