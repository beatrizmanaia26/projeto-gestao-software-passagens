<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const route = useRoute()
const store = useStore()

const valor = Number(route.query.total) || 0

const cartItemIds = String(route.query.items || '')
  .split(',')
  .filter(Boolean)
  .map(Number)

function getUserId() {
  return (
    store.getters['users/userId'] ||
    store.state.users.currentUser?.id ||
    String(route.query.userId || '')
  )
}

function voltar() {
  router.push('/pagamento')
}

// =======================
// SUBMIT PIX
// =======================
(async function getIdentificationTypes() {
    try {
    const identificationTypes = await mp.getIdentificationTypes();
    const identificationTypeElement = document.getElementById('form-checkout__identificationType');

    createSelectOptions(identificationTypeElement, identificationTypes);
    } catch (e) {
    return console.error('Error getting identificationTypes: ', e);
    }
})();

function createSelectOptions(elem, options, labelsAndKeys = { label: "name", value: "id" }) {
    const { label, value } = labelsAndKeys;

    elem.options.length = 0;

    const tempOptions = document.createDocumentFragment();

    options.forEach(option => {
    const optValue = option[value];
    const optLabel = option[label];

    const opt = document.createElement('option');
    opt.value = optValue;
    opt.textContent = optLabel;

    tempOptions.appendChild(opt);
    });

    elem.appendChild(tempOptions);
}

async function submitPixPayment(formData: any) {
  const userId = getUserId()

  console.log('User ID:', userId)
  console.log('Cart items:', cartItemIds)
  console.log('Form PIX:', formData)

  if (!userId) {
    alert('Usuário não identificado')
    router.push('/login')
    return
  }

  if (!cartItemIds.length) {
    alert('Carrinho vazio')
    return
  }

  const body = {
    userId,
    cartItemIds,
    paymentMethod: 'pix',
    formData,
    amount: valor
  }

  try {
    const res = await fetch('http://localhost:3000/process_order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok) throw data

    console.log('Resposta PIX:', data)

    if (data.success) {
        router.push({
        path: '/pix',
        query: {
            qr: data.qr_code,
            qrBase64: data.qr_code_base64,
            ticket: data.ticket_url
        }
        })
    }
    else {
        alert(data.message || 'Erro no PIX')
    }

  } catch (err: any) {
    console.error('Erro PIX:', err)
    alert(err?.error || err?.message || 'Erro ao gerar PIX')
  }
}

// =======================
// HANDLER FORM
// =======================
function handleSubmit(e: Event) {
  e.preventDefault()

  const form = e.target as HTMLFormElement

  const formData = {
    payerFirstName: (form.querySelector('#form-checkout__payerFirstName') as HTMLInputElement).value,
    payerLastName: (form.querySelector('#form-checkout__payerLastName') as HTMLInputElement).value,
    email: (form.querySelector('#form-checkout__email') as HTMLInputElement).value,
    identificationType: (form.querySelector('#form-checkout__identificationType') as HTMLSelectElement).value,
    identificationNumber: (form.querySelector('#form-checkout__identificationNumber') as HTMLInputElement).value,
    }

  submitPixPayment(formData)
}

onMounted(async () => {
  // @ts-ignore
  const mp = new window.MercadoPago('APP_USR-42ba0617-ac83-4101-b277-5b8b4552793d', {
    locale: 'pt-BR',
  })

  try {
    const identificationTypes = await mp.getIdentificationTypes()

    const select = document.getElementById('form-checkout__identificationType')

    if (!select) return

    identificationTypes.forEach((type: any) => {
      const option = document.createElement('option')
      option.value = type.id
      option.textContent = type.name
      select.appendChild(option)
    })

  } catch (e) {
    console.error('Erro ao buscar tipos de documento:', e)
  }
})
</script>

<template>
  <div class="pagamento">
    <main class="conteudo">
      <h2>Pagamento com PIX</h2>

      <div class="valor">
        Total: R$ {{ valor }}
      </div>

      <form id="form-checkout" @submit="handleSubmit">
    <div>
      <div>
        <label for="payerFirstName">Nome</label>
        <input id="form-checkout__payerFirstName" name="payerFirstName" type="text">
      </div>
      <div>
        <label for="payerLastName">Sobrenome</label>
        <input id="form-checkout__payerLastName" name="payerLastName" type="text">
      </div>
      <div>
        <label for="email">E-mail</label>
        <input id="form-checkout__email" name="email" type="text">
      </div>
      <div>
        <label for="identificationType">Tipo de documento</label>
        <select id="form-checkout__identificationType" name="identificationType" type="text"></select>
      </div>
      <div>
        <label for="identificationNumber">Número do documento</label>
        <input id="form-checkout__identificationNumber" name="identificationNumber" type="text">
      </div>
    </div>

    <div>
      <div>
        <input type="hidden" name="transactionAmount" id="transactionAmount" value="100">
        <input type="hidden" name="description" id="description" value="Nome do Produto">
        <br>
        <button type="submit">Pagar</button>
      </div>
    </div>
  </form>

      <button class="voltar" @click="voltar">
        Voltar
      </button>
    </main>
  </div>
</template>

<style scoped>
h2 {
  color: white;
}

.pagamento {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  color: white;
  display: flex;
  flex-direction: column;
  font-family: Arial, Helvetica, sans-serif;
}

.conteudo {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

/* ===================== */
/* FORM PIX */
/* ===================== */

#form-checkout {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 320px;
}

/* agrupar cada campo */
#form-checkout > div > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* labels */
#form-checkout label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

/* inputs e select */
#form-checkout input,
#form-checkout select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 12px;
  color: white;
  outline: none;
  transition: 0.2s;
}

/* placeholder */
#form-checkout input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* focus */
#form-checkout input:focus,
#form-checkout select:focus {
  border: 1px solid #667eea;
}

/* botão */
#form-checkout button {
  margin-top: 10px;
  padding: 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: white;

  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: 0.2s;
}

/* hover */
#form-checkout button:hover {
  opacity: 0.9;
  transform: scale(1.02);
}
</style>