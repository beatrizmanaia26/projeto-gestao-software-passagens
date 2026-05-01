<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
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

function irHome() {
  router.push('/')
}

const renderCardPaymentBrick = async (bricksBuilder: any) => {
  const settings = {
    initialization: {
      amount: valor,
    },

    callbacks: {
      onReady: () => {
        console.log('Brick pronto')
      },

      onSubmit: (formData: any, additionalData: any) => {
        return new Promise((resolve, reject) => {
          const userId = getUserId()

          console.log('User ID antes de enviar:', userId)
          console.log('Cart items antes de enviar:', cartItemIds)

          if (!userId) {
            alert('Usuário não identificado. Faça login novamente.')
            router.push('/login')
            reject('userId não encontrado')
            return
          }

          if (!cartItemIds.length) {
            alert('Nenhum item do carrinho foi enviado para pagamento.')
            reject('cartItemIds vazio')
            return
          }

          const body = {
            userId,
            cartItemIds,
            formData,
            additionalData
          }

          console.log('Dados enviados para o backend:', body)

          fetch('http://localhost:3000/process_order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          })
            .then(async (res) => {
              const data = await res.json()

              if (!res.ok) {
                throw data
              }

              return data
            })
            .then((res) => {
              console.log('Resposta do pagamento:', res)

              if (res.success) {
                alert('Pagamento aprovado! Suas passagens foram compradas.')
                router.push('/usuario')
                resolve(res)
              } else {
                alert(res.message || 'Pagamento não aprovado.')
                reject(res)
              }
            })
            .catch((err) => {
              console.error('Erro no pagamento:', err)
              alert(err?.error || err?.message || 'Erro ao processar pagamento')
              reject(err)
            })
        })
      },

      onError: (error: any) => {
        console.error('Erro no Brick:', error)
      },
    },
  }

  // @ts-ignore
  window.cardPaymentBrickController = await bricksBuilder.create(
    'cardPayment',
    'cardPaymentBrick_container',
    settings
  )
}

onMounted(() => {
  // Use sua PUBLIC KEY de teste aqui.
  // @ts-ignore
  const mp = new window.MercadoPago('APP_USR-42ba0617-ac83-4101-b277-5b8b4552793d', {
    locale: 'pt-BR',
  })

  const bricksBuilder = mp.bricks()

  renderCardPaymentBrick(bricksBuilder)
})

onBeforeUnmount(() => {
  // @ts-ignore
  if (window.cardPaymentBrickController) {
    // @ts-ignore
    window.cardPaymentBrickController.unmount()
  }
})
</script>

<template>
  <div class="pagamento">

    <!-- CONTEÚDO -->
    <main class="conteudo">
      <h2>Pagamento com Cartão</h2>


    <div class="valor">
      Total: R$ {{ valor }}
    </div>

      <!-- Aqui o Brick vai aparecer -->
      <div id="cardPaymentBrick_container"></div>

      <button class="voltar" @click="voltar">
        Voltar
      </button>
    </main>

  </div>
</template>

<style scoped>
h2{
  color: white;
}
.pagamento{
  min-height:100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  color:white;
  display:flex;
  flex-direction:column;
  font-family:Arial, Helvetica, sans-serif;
}

.navbar{
  background: rgba(0, 0, 0, 0.8);
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding: 20px 40px;
}

.logo{
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.conteudo{
  flex:1;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  gap: 30px;
}

.voltar{
  margin-top: 20px;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
}

.voltar:hover{
  color: white;
}

.valor {
  font-size: 20px;
  font-weight: 600;
  background: rgba(255,255,255,0.05);
  padding: 12px 20px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
}
</style>