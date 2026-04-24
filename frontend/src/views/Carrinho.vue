<template>
  <div class="carrinho-container">
    <!-- NAVBAR -->
    <header class="navbar">
      <div class="logo" @click="irHome">-Horas</div>

      <div class="nav-icons">
        <div class="icon-button active">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </div>

        <div class="usuario" @click="irUsuario">
          Usuario
        </div>
      </div>
    </header>

    <!-- CONTEÚDO DO CARRINHO -->
    <main class="carrinho-content">
      <h1 class="titulo">Meu Carrinho</h1>

      <!-- USUÁRIO NÃO AUTENTICADO -->
      <div v-if="!isAuthenticated" class="carrinho-vazio">
        <div class="icone-vazio">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </div>

        <h2>Faça login para acessar seu carrinho</h2>
        <p>Entre na sua conta para visualizar e gerenciar seus itens salvos</p>

        <button class="btn-login-principal" @click="irLogin">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
          </svg>
          Fazer Login
        </button>
      </div>

      <!-- LOADING -->
      <div v-else-if="loading" class="mensagem">Carregando carrinho...</div>

      <!-- ERRO -->
      <div v-else-if="error" class="mensagem-erro">{{ error }}</div>

      <!-- CARRINHO VAZIO -->
      <div v-else-if="!cartItems || cartItems.length === 0" class="carrinho-vazio">
        <div class="icone-vazio">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </div>

        <h2>Seu carrinho está vazio</h2>
        <p>Adicione passagens aéreas ou marítimas para começar sua viagem!</p>

        <div class="botoes-vazio">
          <button class="btn-continuar-comprando" @click="continuarComprando">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Continuar Comprando
          </button>

          <button class="btn-passagens aereas" @click="irPassagensAereas">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
            Passagens Aéreas
          </button>

          <button class="btn-passagens maritimas" @click="irPassagensMaritimas">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/>
            </svg>
            Passagens Marítimas
          </button>
        </div>
      </div>

      <!-- LISTA DE ITENS DO CARRINHO -->
      <div v-else>
        <div class="lista-carrinho">
          <div v-for="item in cartItems" :key="item.id" class="item-carrinho">
            <input
              type="checkbox"
              :id="`item-${item.id}`"
              v-model="item.selected"
              class="checkbox-item"
            />
            <div class="item-info">
              <div class="item-header">
                <h3>{{ item.trips?.origin }} → {{ item.trips?.destination }}</h3>
                <span class="item-tipo">{{ item.trips?.type === 'air' ? '✈️ Aérea' : '🚢 Marítima' }}</span>
              </div>
              <div class="item-detalhes">
                <span v-if="item.trip_seats" class="detalhe-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 18v3h3v-3h10v3h3v-6H4v3zm15-8h3v3h-3v-3zM2 10h3v3H2v-3zm15 3H7V5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v8z"/>
                  </svg>
                  {{ item.trip_seats.seat_number }} - {{ item.trip_seats.class }}
                </span>
                <span v-if="item.trip_cabins" class="detalhe-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2z"/>
                  </svg>
                  {{ item.trip_cabins.cabin_number }} - {{ item.trip_cabins.cabin_type }}
                </span>
              </div>
              <p class="item-preco">R$ {{ Number(item.trips?.price || 0).toFixed(2) }}</p>
            </div>
            <button @click="removerItem(item.id)" class="btn-remover" title="Remover item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- RESUMO E BOTÃO DE COMPRA -->
        <div class="resumo-compra">
          <div class="resumo-info">
            <div class="resumo-linha">
              <span class="resumo-label">Itens selecionados:</span>
              <span class="resumo-valor">{{ itensSelecionados.length }}</span>
            </div>
            <div class="resumo-linha total">
              <span class="resumo-label">Total:</span>
              <span class="resumo-valor">R$ {{ totalSelecionado.toFixed(2) }}</span>
            </div>
          </div>

          <div class="botoes-acao">
            <button class="btn-continuar-comprando-resumo" @click="continuarComprando">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              Continuar Comprando
            </button>

            <button
              class="btn-confirmar-compra"
              :disabled="itensSelecionados.length === 0"
              @click="confirmarCompra"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              Confirmar Compra
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { cartService } from '@/services/supabase'

const router = useRouter()
const route = useRoute()
const store = useStore()

const loading = ref(false)
const error = ref(null)
const cartItems = ref([])
const isAuthenticated = computed(() => store.getters['users/isAuthenticated'])

const itensSelecionados = computed(() => {
  return (cartItems.value || []).filter(item => item.selected)
})

const totalSelecionado = computed(() => {
  return itensSelecionados.value.reduce((total, item) => {
    return total + Number(item.trips?.price || 0)
  }, 0)
})

function irHome() {
  router.push('/home')
}

function irUsuario() {
  router.push('/usuario')
}

function irLogin() {
  router.push('/login')
}

function irCadastrar() {
  router.push('/cadastrar')
}

function irPassagensAereas() {
  router.push('/aereas')
}

function irPassagensMaritimas() {
  router.push('/maritimas')
}

function continuarComprando() {
  // Verifica se veio de uma página específica
  const from = route.query.from

  if (from === 'aereas') {
    router.push('/aereas')
  } else if (from === 'maritimas') {
    router.push('/maritimas')
  } else {
    // Se não veio de nenhuma página específica, volta para home
    router.push('/home')
  }
}

function confirmarCompra() {
  if (itensSelecionados.value.length === 0) {
    mostrarToast('Selecione pelo menos uma passagem', 'error')
    return
  }

  // Redirecionar para página de pagamento
  mostrarToast('Redirecionando para pagamento...', 'success')
  setTimeout(() => {
    router.push('/pagamento')
  }, 1000)
}

async function removerItem(itemId) {
  if (!confirm('Deseja realmente remover este item do carrinho?')) return

  try {
    await cartService.removeItem(itemId)
    // Remover da lista local
    cartItems.value = cartItems.value.filter(item => item.id !== itemId)
    mostrarToast('Item removido do carrinho', 'success')
  } catch (error) {
    console.error('Erro ao remover item:', error)
    mostrarToast('Erro ao remover item', 'error')
  }
}

function mostrarToast(mensagem, tipo = 'success') {
  const toastAnterior = document.querySelector('.toast-message')
  if (toastAnterior) toastAnterior.remove()

  const toast = document.createElement('div')
  toast.className = `toast-message toast-${tipo}`

  const icon = tipo === 'success'
    ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>'

  toast.innerHTML = `${icon}<span>${mensagem}</span>`
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease-out reverse'
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

onMounted(async () => {
  console.log('🛒 Carrinho montado')
  console.log('Autenticado?', isAuthenticated.value)

  if (!isAuthenticated.value) {
    console.log('❌ Usuário não autenticado')
    return
  }

  loading.value = true
  error.value = null

  try {
    const userId = store.getters['users/userId']
    console.log('👤 User ID:', userId)

    if (!userId) {
      error.value = 'Usuário não autenticado'
      console.log('❌ User ID não encontrado')
      return
    }

    console.log('📡 Buscando itens do carrinho...')
    const items = await cartService.getCartItems(userId)
    console.log('✅ Itens recebidos:', items)

    cartItems.value = items || []
  } catch (err) {
    console.error('❌ Erro ao carregar carrinho:', err)
    error.value = err.message || 'Erro ao carregar carrinho'
  } finally {
    loading.value = false
    console.log('✅ Loading finalizado')
  }
})
</script>

<style scoped>
.carrinho-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  color: white;
  font-family: Arial, Helvetica, sans-serif;
}

/* NAVBAR */
.navbar {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 35px 40px 20px;
  border-bottom: 2px solid transparent;
  border-image: linear-gradient(90deg, transparent, #667eea, transparent) 1;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.logo {
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.nav-icons {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-button {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
}

.icon-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.icon-button:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: #667eea;
  transform: translateY(-2px);
}

.icon-button svg {
  width: 24px;
  height: 24px;
  color: white;
}

.usuario {
  cursor: pointer;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.usuario:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

/* CONTEÚDO */
.carrinho-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.titulo {
  font-size: 36px;
  margin-bottom: 50px;
  text-align: center;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
}

/* CARRINHO VAZIO */
.carrinho-vazio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 40px 20px;
}

.icone-vazio {
  width: 140px;
  height: 140px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border: 3px solid rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 35px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
  }
}

.icone-vazio svg {
  width: 70px;
  height: 70px;
  color: #667eea;
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3));
}

.carrinho-vazio h2 {
  font-size: 32px;
  margin-bottom: 20px;
  color: white;
  font-weight: bold;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.carrinho-vazio p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 45px;
  max-width: 550px;
  line-height: 1.6;
}

.botoes-vazio {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-passagens {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.btn-passagens svg {
  width: 24px;
  height: 24px;
}

.btn-passagens.aereas,
.btn-passagens.maritimas {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-passagens.aereas:hover,
.btn-passagens.maritimas:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-login-principal {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 18px 48px;
  border: none;
  border-radius: 14px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
  min-width: 280px;
  margin-top: 10px;
}

.btn-login-principal::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn-login-principal:hover::before {
  left: 100%;
}

.btn-login-principal svg {
  width: 26px;
  height: 26px;
  transition: transform 0.3s ease;
}

.btn-login-principal:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.6);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.btn-login-principal:hover svg {
  transform: translateX(4px);
}

.btn-login-principal:active {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.5);
}

/* LISTA DE ITENS */
.lista-carrinho {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.item-carrinho {
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 2px solid #333;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.item-carrinho:hover {
  border-color: #0ea5e9;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.2);
}

.checkbox-item {
  width: 24px;
  height: 24px;
  cursor: pointer;
  accent-color: #0ea5e9;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.item-info h3 {
  font-size: 22px;
  margin: 0;
  color: white;
  font-weight: 600;
}

.item-tipo {
  font-size: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 600;
  white-space: nowrap;
}

.item-detalhes {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.detalhe-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.3);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #0ea5e9;
  font-weight: 500;
}

.detalhe-badge svg {
  width: 18px;
  height: 18px;
}

.item-preco {
  font-size: 28px;
  font-weight: bold;
  color: #22c55e;
  margin: 0;
  text-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

.btn-remover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  border: none;
  border-radius: 10px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.btn-remover:hover {
  background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(220, 38, 38, 0.5);
}

.btn-remover svg {
  width: 22px;
  height: 22px;
  color: white;
}

.mensagem {
  text-align: center;
  padding: 50px 40px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 16px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  max-width: 600px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mensagem-erro {
  text-align: center;
  padding: 30px 40px;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(185, 28, 28, 0.1) 100%);
  border: 2px solid rgba(248, 113, 113, 0.5);
  border-radius: 16px;
  color: #f87171;
  font-size: 16px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 8px 32px rgba(220, 38, 38, 0.2);
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

/* TOAST MESSAGES */
.toast-message {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 15px;
  z-index: 1000;
  animation: slideDown 0.3s ease-out;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

@keyframes slideDown {
  from {
    transform: translateY(-100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.toast-message svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.toast-success {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border: 2px solid rgba(34, 197, 94, 0.5);
}

.toast-error {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  border: 2px solid rgba(220, 38, 38, 0.5);
}

/* RESUMO E BOTÃO DE COMPRA */
.resumo-compra {
  max-width: 900px;
  margin: 40px auto 0;
  padding: 30px;
  background: linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.resumo-info {
  margin-bottom: 25px;
}

.resumo-linha {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.resumo-linha.total {
  border-bottom: none;
  padding-top: 20px;
  margin-top: 10px;
  border-top: 2px solid rgba(102, 126, 234, 0.3);
}

.resumo-label {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
}

.resumo-linha.total .resumo-label {
  font-size: 20px;
  font-weight: bold;
  color: white;
}

.resumo-valor {
  font-size: 18px;
  font-weight: 600;
  color: #0ea5e9;
}

.resumo-linha.total .resumo-valor {
  font-size: 28px;
  font-weight: bold;
  color: #22c55e;
  text-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

.botoes-acao {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-continuar-comprando,
.btn-continuar-comprando-resumo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 32px;
  border: 2px solid #667eea;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  background: transparent;
}

.btn-continuar-comprando svg,
.btn-continuar-comprando-resumo svg {
  width: 24px;
  height: 24px;
}

.btn-continuar-comprando:hover,
.btn-continuar-comprando-resumo:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-continuar-comprando-resumo {
  flex: 1;
  min-width: 200px;
}

.btn-confirmar-compra {
  flex: 1;
  min-width: 200px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  color: white;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.4);
  position: relative;
  overflow: hidden;
}

.btn-confirmar-compra::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn-confirmar-compra:hover::before {
  left: 100%;
}

.btn-confirmar-compra svg {
  width: 26px;
  height: 26px;
  transition: transform 0.3s ease;
}

.btn-confirmar-compra:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 40px rgba(34, 197, 94, 0.6);
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
}

.btn-confirmar-compra:hover:not(:disabled) svg {
  transform: scale(1.2);
}

.btn-confirmar-compra:active:not(:disabled) {
  transform: translateY(-2px) scale(1);
  box-shadow: 0 6px 24px rgba(34, 197, 94, 0.5);
}

.btn-confirmar-compra:disabled {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  box-shadow: none;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-confirmar-compra:disabled svg {
  opacity: 0.5;
}

/* Responsive */
@media (max-width: 768px) {
  .titulo {
    font-size: 24px;
  }

  .carrinho-vazio h2 {
    font-size: 22px;
  }

  .botoes-vazio {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }

  .btn-passagens,
  .btn-continuar-comprando {
    width: 100%;
    justify-content: center;
  }

  .item-carrinho {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-remover {
    align-self: flex-end;
  }

  .botoes-acao {
    flex-direction: column;
  }

  .btn-continuar-comprando-resumo,
  .btn-confirmar-compra {
    width: 100%;
  }
}
</style>
