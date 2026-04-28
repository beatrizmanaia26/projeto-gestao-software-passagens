require('dotenv').config({ path: __dirname + '/.env' });
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

const { MercadoPagoConfig, Payment } = require('mercadopago');

const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-786415814028835-042719-42944073ad46f6299c0e57bc3a2738d2-3357360729'
});

const paymentClient = new Payment(client);

app.post("/process_order", async (req, res) => {
  console.log("CHEGOU REQUISIÇÃO")

  try {
    const body = req.body

    const payment = {
      transaction_amount: Number(formData.transaction_amount),
      token: formData.token,
      description: "Pagamento -Horas",
      installments: formData.installments,
      payment_method_id: formData.payment_method_id,
      payer: {
        email: formData.payer.email,
        identification: formData.payer.identification,
      },
    }

    const response = await paymentClient.create({ body: payment })

    return res.json({
      status: response.status,
      data: response
    })

  } catch (error) {
    console.error("Erro no pagamento:", error)

    return res.status(500).json({
      error: "Erro ao processar pagamento",
      detalhe: error.message,
    })
  }
})

app.use('/users', usersRoutes);
app.use('/trips', tripsRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/payments', paymentsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Backend funcionando' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const supabase = require('./src/models/supabaseClient');

app.get('/teste-users', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, cpf');

  if (error) {
    return res.status(400).json(error);
  }

  res.json(data);
});