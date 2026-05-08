// ============================================================
// MOCK BACKEND - backend/server-mock.js
// Roda com: node server-mock.js
// Porta: 3000 (igual ao backend real)
// ============================================================

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ============================================================
// DADOS EM MEMÓRIA
// ============================================================

let users = [
  {
    id: '1',
    name: 'Usuário Teste',
    email: 'teste@teste.com',
    password: '123456a',
    cpf: '12345678900'
  }
];

let nextUserId = 2;

const trips = [
  // AÉREAS (type: 'air')
  { id: '1', type: 'air', origin: 'São Paulo', destination: 'Rio de Janeiro', departure_time: '2025-08-10T08:00:00Z', arrival_time: '2025-08-10T09:00:00Z', price: 350.00 },
  { id: '2', type: 'air', origin: 'Brasília', destination: 'Fortaleza', departure_time: '2025-08-12T10:30:00Z', arrival_time: '2025-08-12T13:00:00Z', price: 520.00 },
  { id: '3', type: 'air', origin: 'Curitiba', destination: 'Manaus', departure_time: '2025-08-15T06:00:00Z', arrival_time: '2025-08-15T10:00:00Z', price: 890.00 },
  { id: '4', type: 'air', origin: 'Salvador', destination: 'Porto Alegre', departure_time: '2025-08-18T14:00:00Z', arrival_time: '2025-08-18T17:30:00Z', price: 670.00 },
  { id: '5', type: 'air', origin: 'Recife', destination: 'São Paulo', departure_time: '2025-08-20T07:00:00Z', arrival_time: '2025-08-20T10:00:00Z', price: 430.00 },

  // MARÍTIMAS (type: 'sea')
  { id: '6', type: 'sea', origin: 'Santos', destination: 'Rio de Janeiro', departure_time: '2025-08-11T18:00:00Z', arrival_time: '2025-08-13T08:00:00Z', price: 800.00 },
  { id: '7', type: 'sea', origin: 'Salvador', destination: 'Recife', departure_time: '2025-08-14T20:00:00Z', arrival_time: '2025-08-16T10:00:00Z', price: 1200.00 },
  { id: '8', type: 'sea', origin: 'Manaus', destination: 'Belém', departure_time: '2025-08-17T08:00:00Z', arrival_time: '2025-08-20T18:00:00Z', price: 950.00 },
];

// Gera assentos para cada viagem aérea
const seats = {};
trips.filter(t => t.type === 'air').forEach(trip => {
  seats[trip.id] = [];
  const classes = ['Econômica', 'Econômica', 'Econômica', 'Executiva', 'Executiva', 'Primeira Classe'];
  let id = 1;
  for (let row = 1; row <= 20; row++) {
    for (const letter of ['A', 'B', 'C', 'D', 'E', 'F']) {
      const cls = row <= 3 ? 'Primeira Classe' : row <= 8 ? 'Executiva' : 'Econômica';
      seats[trip.id].push({
        id: `seat-${trip.id}-${id}`,
        trip_id: trip.id,
        seat_number: `${row}${letter}`,
        class: cls,
        available: Math.random() > 0.3
      });
      id++;
    }
  }
});

// Gera cabines para cada viagem marítima
const cabins = {};
trips.filter(t => t.type === 'sea').forEach(trip => {
  cabins[trip.id] = [];
  const types = ['Interna', 'Externa', 'Varanda', 'Suíte'];
  let id = 1;
  for (let i = 101; i <= 150; i++) {
    const cabin_type = i <= 115 ? 'Interna' : i <= 130 ? 'Externa' : i <= 145 ? 'Varanda' : 'Suíte';
    cabins[trip.id].push({
      id: `cabin-${trip.id}-${id}`,
      trip_id: trip.id,
      cabin_number: String(i),
      cabin_type,
      capacity: cabin_type === 'Suíte' ? 4 : 2,
      available: Math.random() > 0.3
    });
    id++;
  }
});

// Carrinhos: { userId -> { id, user_id, items: [...] } }
const carts = {};
let nextCartId = 100;
let nextCartItemId = 1000;

// Pedidos
const orders = [];
let nextOrderId = 1;

// ============================================================
// HELPERS
// ============================================================

function getOrCreateCart(userId) {
  if (!carts[userId]) {
    carts[userId] = {
      id: String(nextCartId++),
      user_id: userId,
      items: []
    };
  }
  return carts[userId];
}

function findUserById(id) {
  return users.find(u => u.id === String(id));
}

function getTripWithDetails(item) {
  const trip = trips.find(t => t.id === item.trip_id);
  const seat = item.seat_id ? Object.values(seats).flat().find(s => s.id === item.seat_id) : null;
  const cabin = item.cabin_id ? Object.values(cabins).flat().find(c => c.id === item.cabin_id) : null;
  return { ...item, trips: trip, trip_seats: seat, trip_cabins: cabin };
}

// ============================================================
// ROTAS: USERS
// ============================================================

// POST /users/register
app.post('/users/register', (req, res) => {
  const { name, email, password, cpf } = req.body;

  if (!name || !email || !password || !cpf) {
    return res.status(400).json({ error: 'Preencha todos os campos' });
  }

  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(400).json({ error: 'Email já cadastrado' });
  }

  const cpfExists = users.find(u => u.cpf === cpf.replace(/\D/g, ''));
  if (cpfExists) {
    return res.status(400).json({ error: 'CPF já cadastrado' });
  }

  const newUser = {
    id: String(nextUserId++),
    name,
    email,
    password,
    cpf: cpf.replace(/\D/g, '')
  };

  users.push(newUser);

  console.log(`[MOCK] Usuário registrado: ${email}`);

  return res.status(201).json({
    user: { id: newUser.id, name: newUser.name, email: newUser.email, cpf: newUser.cpf },
    token: `fake-token-${newUser.id}`
  });
});

// POST /users/login
app.post('/users/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ error: 'Usuário não encontrado' });
  }

  if (user.password !== password) {
    return res.status(400).json({ error: 'Senha inválida' });
  }

  console.log(`[MOCK] Login: ${email}`);

  return res.status(200).json({
    user: { id: user.id, name: user.name, email: user.email, cpf: user.cpf },
    token: `fake-token-${user.id}`
  });
});

// GET /users/:id
app.get('/users/:id', (req, res) => {
  const user = findUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  return res.status(200).json({ id: user.id, name: user.name, email: user.email, cpf: user.cpf });
});

// PUT /users/:id
app.put('/users/:id', (req, res) => {
  const user = findUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  console.log(`[MOCK] Usuário atualizado: ${user.id}`);
  return res.status(200).json({ id: user.id, name: user.name, email: user.email, cpf: user.cpf });
});

// ============================================================
// ROTAS: TRIPS
// ============================================================

// GET /trips
app.get('/trips', (req, res) => {
  let result = [...trips];
  if (req.query.type) {
    result = result.filter(t => t.type === req.query.type);
  }
  if (req.query.origin) {
    result = result.filter(t => t.origin.toLowerCase().includes(req.query.origin.toLowerCase()));
  }
  if (req.query.destination) {
    result = result.filter(t => t.destination.toLowerCase().includes(req.query.destination.toLowerCase()));
  }
  return res.status(200).json(result);
});

// GET /trips/:id
app.get('/trips/:id', (req, res) => {
  const trip = trips.find(t => t.id === req.params.id);
  if (!trip) return res.status(404).json({ error: 'Viagem não encontrada' });
  return res.status(200).json(trip);
});

// GET /trips/:id/seats
app.get('/trips/:id/seats', (req, res) => {
  const tripSeats = seats[req.params.id];
  if (!tripSeats) return res.status(200).json([]);
  return res.status(200).json(tripSeats);
});

// GET /trips/:id/cabins
app.get('/trips/:id/cabins', (req, res) => {
  const tripCabins = cabins[req.params.id];
  if (!tripCabins) return res.status(200).json([]);
  return res.status(200).json(tripCabins);
});

// ============================================================
// ROTAS: CART
// ============================================================

// POST /cart/:userId/add
app.post('/cart/:userId/add', (req, res) => {
  const { userId } = req.params;
  const { trip_id, tripId, seat_id, seatId, cabin_id, cabinId } = req.body;

  const finalTripId = trip_id || tripId;
  const finalSeatId = seat_id || seatId || null;
  const finalCabinId = cabin_id || cabinId || null;

  const trip = trips.find(t => t.id === String(finalTripId));
  if (!trip) return res.status(400).json({ error: 'Viagem não encontrada' });

  // Validar assento se aéreo
  if (trip.type === 'air') {
    if (!finalSeatId) return res.status(400).json({ error: 'Para viagem aérea, informe o seatId' });
    const tripSeats = seats[trip.id] || [];
    const seat = tripSeats.find(s => s.id === finalSeatId);
    if (!seat) return res.status(400).json({ error: 'Assento não encontrado' });
    if (!seat.available) return res.status(400).json({ error: 'Assento indisponível' });
    seat.available = false; // marca como ocupado
  }

  // Validar cabine se marítimo
  if (trip.type === 'sea') {
    if (!finalCabinId) return res.status(400).json({ error: 'Para viagem marítima, informe o cabinId' });
    const tripCabins = cabins[trip.id] || [];
    const cabin = tripCabins.find(c => c.id === finalCabinId);
    if (!cabin) return res.status(400).json({ error: 'Cabine não encontrada' });
    if (!cabin.available) return res.status(400).json({ error: 'Cabine indisponível' });
    cabin.available = false;
  }

  const cart = getOrCreateCart(userId);

  const newItem = {
    id: String(nextCartItemId++),
    cart_id: cart.id,
    trip_id: finalTripId,
    seat_id: finalSeatId,
    cabin_id: finalCabinId,
    quantity: 1
  };

  cart.items.push(newItem);

  console.log(`[MOCK] Item adicionado ao carrinho do usuário ${userId}:`, newItem);

  return res.status(201).json(newItem);
});

// GET /cart/:userId
app.get('/cart/:userId', (req, res) => {
  const cart = getOrCreateCart(req.params.userId);
  const itemsWithDetails = cart.items.map(getTripWithDetails);
  return res.status(200).json({ cart, items: itemsWithDetails });
});

// DELETE /cart/item/:itemId
app.delete('/cart/item/:itemId', (req, res) => {
  const { itemId } = req.params;

  for (const userId in carts) {
    const cart = carts[userId];
    const idx = cart.items.findIndex(i => i.id === itemId);
    if (idx !== -1) {
      const item = cart.items[idx];

      // Restaurar disponibilidade
      if (item.seat_id) {
        const allSeats = Object.values(seats).flat();
        const seat = allSeats.find(s => s.id === item.seat_id);
        if (seat) seat.available = true;
      }
      if (item.cabin_id) {
        const allCabins = Object.values(cabins).flat();
        const cabin = allCabins.find(c => c.id === item.cabin_id);
        if (cabin) cabin.available = true;
      }

      cart.items.splice(idx, 1);
      console.log(`[MOCK] Item ${itemId} removido do carrinho`);
      return res.status(200).json({ message: 'Item removido com sucesso', itemId });
    }
  }

  return res.status(404).json({ error: 'Item não encontrado' });
});

// ============================================================
// ROTAS: ORDERS
// ============================================================

// GET /orders/user/:userId
app.get('/orders/user/:userId', (req, res) => {
  const userOrders = orders.filter(o => o.user_id === req.params.userId && o.status === 'approved');
  return res.status(200).json(userOrders);
});

// ============================================================
// ROTA: PROCESS ORDER (pagamento mock)
// ============================================================

app.post('/process_order', (req, res) => {
  const { userId, cartItemIds, formData, paymentMethod } = req.body;

  console.log('[MOCK] /process_order recebido');
  console.log('  userId:', userId);
  console.log('  cartItemIds:', cartItemIds);

  if (!userId || !cartItemIds || !cartItemIds.length) {
    return res.status(400).json({ success: false, error: 'Dados inválidos' });
  }

  const cart = carts[userId];
  if (!cart) return res.status(400).json({ success: false, error: 'Carrinho não encontrado' });

  const cartItems = cart.items.filter(i => cartItemIds.includes(Number(i.id)) || cartItemIds.includes(i.id));
  if (!cartItems.length) return res.status(400).json({ success: false, error: 'Nenhum item encontrado' });

  const total = cartItems.reduce((sum, item) => {
    const trip = trips.find(t => t.id === item.trip_id);
    return sum + Number(trip?.price || 0);
  }, 0);

  // Criar pedido
  const orderId = nextOrderId++;
  const orderItemsFormatted = cartItems.map(item => {
    const trip = trips.find(t => t.id === item.trip_id);
    const seat = item.seat_id ? Object.values(seats).flat().find(s => s.id === item.seat_id) : null;
    const cabin = item.cabin_id ? Object.values(cabins).flat().find(c => c.id === item.cabin_id) : null;
    return {
      id: item.id,
      trip_id: item.trip_id,
      seat_id: item.seat_id,
      cabin_id: item.cabin_id,
      unit_price: Number(trip?.price || 0),
      trips: trip,
      trip_seats: seat,
      trip_cabins: cabin
    };
  });

  const newOrder = {
    id: orderId,
    user_id: userId,
    total_amount: total,
    status: 'approved',
    order_items: orderItemsFormatted,
    payments: [{
      id: `pay-${orderId}`,
      payment_method: paymentMethod || (formData?.payment_method_id) || 'credit_card',
      payment_status: 'approved',
      transaction_id: `mock-tx-${orderId}`
    }]
  };

  orders.push(newOrder);

  // Remover itens do carrinho
  if (carts[userId]) {
    carts[userId].items = carts[userId].items.filter(
      i => !cartItemIds.includes(Number(i.id)) && !cartItemIds.includes(i.id)
    );
  }

  console.log(`[MOCK] Pedido criado: #${orderId}, total: R$${total.toFixed(2)}`);

  // PIX mock
  if (paymentMethod === 'pix') {
    return res.status(200).json({
      success: true,
      message: 'PIX gerado com sucesso (MOCK)',
      order_id: orderId,
      qr_code: '00020101021126580014br.gov.bcb.pix0136mock-pix-key-for-testing520400005303986540510.005802BR5913Mock-Horas6008Sao Paulo62070503***6304MOCK',
      qr_code_base64: '',
      ticket_url: 'https://example.com/pix-mock'
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Pagamento aprovado (MOCK)',
    order_id: orderId
  });
});

// ============================================================
// ROTA RAIZ
// ============================================================

app.get('/', (req, res) => {
  res.json({ message: '🟢 Mock Backend funcionando na porta 3000' });
});

// ============================================================
// START
// ============================================================

const PORT = 3000;
app.listen(PORT, () => {
  console.log('');
  console.log('🟢 ======================================');
  console.log(`🟢  MOCK BACKEND rodando na porta ${PORT}`);
  console.log('🟢 ======================================');
  console.log('');
  console.log('📋 Usuário de teste:');
  console.log('   Email:    teste@teste.com');
  console.log('   Senha:    123456a');
  console.log('');
  console.log('📦 Dados mockados:');
  console.log(`   ${trips.filter(t => t.type === 'air').length} viagens aéreas`);
  console.log(`   ${trips.filter(t => t.type === 'sea').length} viagens marítimas`);
  console.log('   Assentos e cabines gerados automaticamente');
  console.log('');
});