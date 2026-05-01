require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const usersRoutes = require('./src/routes/usersRoutes');
const tripsRoutes = require('./src/routes/tripsRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const ordersRoutes = require('./src/routes/ordersRoutes');
const paymentsRoutes = require('./src/routes/paymentsRoutes');

const supabase = require('./src/models/supabaseClient');

const { MercadoPagoConfig, Payment } = require('mercadopago');

const app = express();

app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-786415814028835-042719-42944073ad46f6299c0e57bc3a2738d2-3357360729'
});

const paymentClient = new Payment(client);

app.post('/process_order', async (req, res) => {
  console.log('CHEGOU REQUISIÇÃO /process_order');

  let createdOrderId = null;

  try {
    const { userId, cartItemIds, formData, additionalData } = req.body;

    console.log('userId:', userId);
    console.log('cartItemIds:', cartItemIds);
    console.log('formData:', formData);
    console.log('additionalData:', additionalData);

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId não enviado'
      });
    }

    if (!cartItemIds || !Array.isArray(cartItemIds) || cartItemIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum item do carrinho enviado'
      });
    }

    if (!formData) {
      return res.status(400).json({
        success: false,
        error: 'Dados do pagamento não enviados'
      });
    }

    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select(`
        id,
        cart_id,
        trip_id,
        seat_id,
        cabin_id,
        quantity,
        trips (
          id,
          price
        ),
        carts!inner (
          id,
          user_id
        )
      `)
      .in('id', cartItemIds)
      .eq('carts.user_id', userId);

    if (cartError) {
      console.error('Erro ao buscar itens do carrinho:', cartError);
      throw cartError;
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum item do carrinho encontrado para esse usuário'
      });
    }

    const totalAmountNumber = cartItems.reduce((total, item) => {
      const price = Number(item.trips?.price || 0);
      const quantity = Number(item.quantity || 1);

      return total + price * quantity;
    }, 0);

    if (totalAmountNumber <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valor total inválido'
      });
    }

    const totalAmount = totalAmountNumber.toFixed(2);

    console.log('Total calculado pelo banco:', totalAmount);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmountNumber,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Erro ao criar pedido:', orderError);
      throw orderError;
    }

    createdOrderId = order.id;

    console.log('Pedido criado no banco:', order);

    const orderItemsPayload = cartItems.map((item) => ({
      order_id: order.id,
      trip_id: item.trip_id,
      seat_id: item.seat_id,
      cabin_id: item.cabin_id,
      unit_price: Number(item.trips?.price || 0)
    }));

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItemsPayload);

    if (orderItemsError) {
      console.error('Erro ao criar itens do pedido:', orderItemsError);
      throw orderItemsError;
    }

    console.log('Itens do pedido criados:', orderItemsPayload);

    const paymentType =
      additionalData?.paymentTypeId ||
      formData.payment_type_id ||
      'credit_card';

    const mercadoPagoOrderBody = {
      type: 'online',
      processing_mode: 'automatic',
      total_amount: totalAmount,
      external_reference: String(order.id),
      payer: {
        email: formData.payer.email,
        identification: formData.payer.identification
      },
      transactions: {
        payments: [
          {
            amount: totalAmount,
            payment_method: {
              id: formData.payment_method_id,
              type: paymentType,
              token: formData.token,
              installments: Number(formData.installments)
            }
          }
        ]
      }
    };

    console.log('Enviando order para Mercado Pago:', mercadoPagoOrderBody);

    const idempotencyKey = crypto.randomUUID();

    const mpResponse = await fetch('https://api.mercadopago.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': idempotencyKey,
        'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`
      },
      body: JSON.stringify(mercadoPagoOrderBody)
    });

    const mpOrder = await mpResponse.json();

    console.log('Status HTTP Mercado Pago:', mpResponse.status);
    console.log('Resposta Mercado Pago Orders API:', JSON.stringify(mpOrder, null, 2));
    console.log('Erros Mercado Pago:', JSON.stringify(mpOrder.errors, null, 2));


    if (!mpResponse.ok) {
      console.error('Erro Mercado Pago Orders API:', mpOrder);

      await supabase
        .from('orders')
        .update({
          status: 'payment_error'
        })
        .eq('id', order.id);

      return res.status(400).json({
        success: false,
        error: 'Erro ao enviar pagamento para o Mercado Pago',
        detalhe: mpOrder
      });
    }

    const mpPayment = mpOrder.transactions?.payments?.[0];

    const paymentStatus = mpPayment?.status || mpOrder.status;
    const paymentStatusDetail = mpPayment?.status_detail || mpOrder.status_detail;
    const mercadoPagoPaymentId = mpPayment?.id || null;
    const mercadoPagoOrderId = mpOrder.id;

    const { error: paymentInsertError } = await supabase
      .from('payments')
      .insert({
        order_id: order.id,
        payment_method: formData.payment_method_id,
        payment_status: paymentStatus,
        transaction_id: String(mercadoPagoPaymentId || mercadoPagoOrderId)
      });

    if (paymentInsertError) {
      console.error('Erro ao salvar pagamento no banco:', paymentInsertError);
      throw paymentInsertError;
    }

    const isApproved =
      mpOrder.status === 'processed' &&
      paymentStatus === 'processed' &&
      paymentStatusDetail === 'accredited';

    if (isApproved) {
      const { error: updateOrderError } = await supabase
        .from('orders')
        .update({
          status: 'approved'
        })
        .eq('id', order.id);

      if (updateOrderError) {
        console.error('Erro ao aprovar pedido:', updateOrderError);
        throw updateOrderError;
      }

      const { error: deleteCartError } = await supabase
        .from('cart_items')
        .delete()
        .in('id', cartItemIds);

      if (deleteCartError) {
        console.error('Erro ao limpar carrinho:', deleteCartError);
        throw deleteCartError;
      }

      return res.status(200).json({
        success: true,
        message: 'Pagamento aprovado e pedido criado com sucesso',
        order_id: order.id,
        mercado_pago_order_id: mercadoPagoOrderId,
        mercado_pago_payment_id: mercadoPagoPaymentId,
        payment_status: paymentStatus,
        payment_status_detail: paymentStatusDetail
      });
    }

    await supabase
      .from('orders')
      .update({
        status: paymentStatus || mpOrder.status || 'not_approved'
      })
      .eq('id', order.id);

    return res.status(200).json({
      success: false,
      message: `Pagamento não aprovado. Status: ${paymentStatus}`,
      order_id: order.id,
      mercado_pago_order_id: mercadoPagoOrderId,
      mercado_pago_payment_id: mercadoPagoPaymentId,
      payment_status: paymentStatus,
      payment_status_detail: paymentStatusDetail
    });

  } catch (error) {
    console.error('Erro no /process_order:', error);

    if (createdOrderId) {
      await supabase
        .from('orders')
        .update({
          status: 'payment_error'
        })
        .eq('id', createdOrderId);
    }

    return res.status(500).json({
      success: false,
      error: 'Erro ao processar pagamento',
      detalhe: error.message || String(error)
    });
  }
});

app.use('/users', usersRoutes);
app.use('/trips', tripsRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/payments', paymentsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Backend funcionando' });
});

app.get('/teste-users', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, cpf');

  if (error) {
    return res.status(400).json(error);
  }

  res.json(data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});