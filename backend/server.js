require('dotenv').config();
const express = require('express');
const cors = require('cors');

const usersRoutes = require('./src/routes/usersRoutes');
const tripsRoutes = require('./src/routes/tripsRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const ordersRoutes = require('./src/routes/ordersRoutes');
const paymentsRoutes = require('./src/routes/paymentsRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/trips', tripsRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/payments', paymentsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API rodando com Supabase' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});