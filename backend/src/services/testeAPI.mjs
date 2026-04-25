
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-5267418058757263-042420-6f0172f2eff409c6ef0eb7cd1a2cf379-3357360729'
});


const preference = new Preference(client);

const response = await preference.create({
  body: {
    items: [
      {
        title: "Produto teste",
        quantity: 1,
        unit_price: 100
      }
    ],
    back_urls: {
      success: "https://localhost:8080/pagamentoSucesso"
    },
    auto_return: "approved",
  }
});

console.log(response);

// copiar o id