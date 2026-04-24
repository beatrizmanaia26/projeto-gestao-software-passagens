<template>
  <div class="passagens-container">
    <!-- Modal de Seleção de Cabine -->
    <div v-if="mostrarModal" class="modal-overlay" @click.self="fecharModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Selecione sua Cabine</h3>
          <button class="btn-fechar" @click="fecharModal">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div class="viagem-info">
          <p>{{ passagemSelecionada?.origin }} → {{ passagemSelecionada?.destination }}</p>
          <p class="preco">R$ {{ passagemSelecionada?.price?.toFixed(2) }}</p>
        </div>

        <div v-if="cabineSelecionada" class="item-detalhes-selecao">
          <h4>Dados completos do trip cabin selecionado</h4>
          <div class="detalhes-grid">
            <div class="detalhe-box">
              <span class="detalhe-box-label">id</span>
              <span>{{ cabineSelecionada.id }}</span>
            </div>
            <div class="detalhe-box">
              <span class="detalhe-box-label">trip_id</span>
              <span>{{ cabineSelecionada.trip_id }}</span>
            </div>
            <div class="detalhe-box">
              <span class="detalhe-box-label">cabin_number</span>
              <span>{{ cabineSelecionada.cabin_number }}</span>
            </div>
            <div class="detalhe-box">
              <span class="detalhe-box-label">cabin_type</span>
              <span>{{ cabineSelecionada.cabin_type }}</span>
            </div>
            <div class="detalhe-box">
              <span class="detalhe-box-label">capacity</span>
              <span>{{ cabineSelecionada.capacity }}</span>
            </div>
            <div class="detalhe-box">
              <span class="detalhe-box-label">available</span>
              <span>{{ cabineSelecionada.available ? 'true' : 'false' }}</span>
            </div>
          </div>
        </div>

        <!-- Filtro por Tipo de Cabine -->
        <div class="filtro-classe">
          <button
            v-for="tipo in tiposDisponiveis"
            :key="tipo"
            :class="['btn-classe', { active: tipoAtivo === tipo }]"
            @click="tipoAtivo = tipo"
          >
            {{ tipo }}
          </button>
        </div>

        <div v-if="carregandoCabines" class="loading">Carregando cabines...</div>
        <div v-else-if="erroCarregamento" class="sem-assentos">
          {{ erroCarregamento }}
        </div>
        <div v-else-if="cabinesFiltradas.length === 0" class="sem-assentos">
          Nenhuma cabine encontrada para esta passagem neste tipo.
        </div>
        <div v-else class="lista-opcoes">
          <label
            v-for="cabine in cabinesFiltradas"
            :key="cabine.id"
            :class="['opcao-item', { indisponivel: !cabine.available, selecionado: cabineSelecionada?.id === cabine.id }]"
          >
            <input
              type="radio"
              name="cabine"
              :value="cabine.id"
              :checked="cabineSelecionada?.id === cabine.id"
              :disabled="!cabine.available"
              @change="selecionarCabine(cabine)"
            />
            <div class="opcao-conteudo">
              <div class="opcao-topo">
                <strong>{{ cabine.cabin_number }}</strong>
              </div>
              <div class="detalhes-grid">
                <div class="detalhe-box">
                  <span class="detalhe-box-label">Código</span>
                  <span>{{ cabine.id }}</span>
                </div>
                <div class="detalhe-box">
                  <span class="detalhe-box-label">Código Viagem</span>
                  <span>{{ cabine.trip_id }}</span>
                </div>
                <div class="detalhe-box">
                  <span class="detalhe-box-label">Número Cabine</span>
                  <span>{{ cabine.cabin_number }}</span>
                </div>
                <div class="detalhe-box">
                  <span class="detalhe-box-label">Tipo Cabine</span>
                  <span>{{ cabine.cabin_type }}</span>
                </div>
                <div class="detalhe-box">
                  <span class="detalhe-box-label">Capacidade</span>
                  <span>{{ cabine.capacity }}</span>
                </div>
              </div>
            </div>
          </label>
        </div>

        <!-- Botões de Ação -->
        <div class="modal-acoes">
          <button class="btn-cancelar" @click="fecharModal">Cancelar</button>
          <button
            class="btn-confirmar"
            @click="confirmarSelecao"
            :disabled="!cabineSelecionada"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>

  <header class="navbar">
      <div class="logo" @click="irHome">-Horas</div>

      <div class="nav-icons">
        <div class="icon-button" @click="irCarrinho" title="Carrinho">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </div>

        <div class="usuario" @click="irUsuario">
          Usuario
        </div>
      </div>
    </header>

    <h2>Passagens Marítimas 🚢</h2>

    <div v-if="loading" class="mensagem">
      Carregando passagens...
    </div>

    <div v-else-if="error" class="mensagem-erro">
      {{ error }}
    </div>

    <div v-else-if="passagens.length === 0" class="mensagem">
      Nenhuma passagem marítima disponível no momento.
    </div>

    <div v-else class="lista-passagens">
      <div
        v-for="passagem in passagens"
        :key="passagem.id"
        class="card-passagem"
      >
        <div @click="selecionada = selecionada?.id === passagem.id ? null : passagem">
          <div class="card-rota">
            <span class="cidade">{{ passagem.origin }}</span>
            <span class="seta">→</span>
            <span class="cidade">{{ passagem.destination }}</span>
            <!-- Botão Adicionar ao Carrinho - pequeno ao lado do destino -->
            <button class="btn-adicionar-mini" @click.stop="adicionarAoCarrinho(passagem)" title="Adicionar ao carrinho">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"/>
              </svg>
            </button>
          </div>

          <div class="card-preco">
            R$ {{ Number(passagem.price).toFixed(2) }}
          </div>

          <!-- DETALHES — aparecem ao clicar -->
          <div v-if="selecionada?.id === passagem.id" class="card-detalhes">
            <div class="detalhe">
              <span class="detalhe-label">Embarque</span>
              <span>{{ formatarData(passagem.departure_time) }}</span>
              <span>{{ formatarHora(passagem.departure_time) }}</span>
            </div>
            <div class="detalhe">
              <span class="detalhe-label">Desembarque</span>
              <span>{{ formatarData(passagem.arrival_time) }}</span>
              <span>{{ formatarHora(passagem.arrival_time) }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const router = useRouter()

function irUsuario() {
  router.push('/usuario')
}

function irCarrinho() {
  router.push('/carrinho?from=maritimas')
}

function irHome(){
  router.push('/home')
}
const store = useStore()
const selecionada = ref(null)

const loading = computed(() => store.state.trips.loading)
const error = computed(() => store.state.trips.error)
const passagens = computed(() => store.getters['trips/maritimeTrips'])
const isAuthenticated = computed(() => store.getters['users/isAuthenticated'])

function formatarData(datetime) {
  return new Date(datetime).toLocaleDateString('pt-BR')
}

function formatarHora(datetime) {
  return new Date(datetime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function mostrarToast(mensagem, tipo = 'success') {
  // Remove toast anterior se existir
  const toastAnterior = document.querySelector('.toast-message')
  if (toastAnterior) {
    toastAnterior.remove()
  }

  // Cria novo toast
  const toast = document.createElement('div')
  toast.className = `toast-message toast-${tipo}`

  const icon = tipo === 'success'
    ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>'

  toast.innerHTML = `${icon}<span>${mensagem}</span>`
  document.body.appendChild(toast)

  // Remove após 3 segundos
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease-out reverse'
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

// Estado do modal
const mostrarModal = ref(false)
const passagemSelecionada = ref(null)
const cabinesDisponiveis = ref([])
const carregandoCabines = ref(false)
const erroCarregamento = ref('')
const tipoAtivo = ref('Interna')
const cabineSelecionada = ref(null)

// Tipos disponíveis - apenas os que existem no BD para esta passagem
const tiposDisponiveis = computed(() => {
  const cabinesDisponiveisOnly = cabinesDisponiveis.value.filter(c => c.available)
  const tipos = [...new Set(cabinesDisponiveisOnly.map(c => c.cabin_type).filter(Boolean))]
  return tipos
})

// Filtrar cabines por tipo - apenas disponíveis
const cabinesFiltradas = computed(() => {
  return cabinesDisponiveis.value.filter(c => c.cabin_type === tipoAtivo.value && c.available)
})

// Abrir modal e buscar cabines
async function adicionarAoCarrinho(passagem) {
  // Verifica se o usuário está autenticado
  if (!isAuthenticated.value) {
    if (confirm('Você precisa fazer login para adicionar ao carrinho. Deseja ir para a página de login?')) {
      router.push('/login')
    }
    return
  }

  passagemSelecionada.value = passagem
  mostrarModal.value = true
  carregandoCabines.value = true
  erroCarregamento.value = ''
  cabineSelecionada.value = null
  cabinesDisponiveis.value = []

  try {
    const response = await fetch(`http://localhost:3000/trips/${passagem.id}/cabins`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData?.error || 'Erro ao carregar cabines')
    }

    const data = await response.json()
    cabinesDisponiveis.value = Array.isArray(data) ? data : []

    if (cabinesDisponiveis.value.length > 0) {
      tipoAtivo.value = cabinesDisponiveis.value[0].cabin_type || 'Interna'
    }
  } catch (error) {
    console.error('Erro ao buscar cabines:', error)
    erroCarregamento.value = error.message || 'Erro ao carregar cabines'
    mostrarToast('Erro ao carregar cabines', 'error')
  } finally {
    carregandoCabines.value = false
  }
}

// Selecionar cabine
function selecionarCabine(cabine) {
  if (!cabine.available) return
  cabineSelecionada.value = cabine
}

// Fechar modal
function fecharModal() {
  mostrarModal.value = false
  passagemSelecionada.value = null
  cabinesDisponiveis.value = []
  erroCarregamento.value = ''
  cabineSelecionada.value = null
}

// Confirmar seleção e adicionar ao carrinho
async function confirmarSelecao() {
  if (!cabineSelecionada.value || !passagemSelecionada.value) return

  try {
    await store.dispatch('cart/addItem', {
      trip_id: passagemSelecionada.value.id,
      quantity: 1,
      seat_id: null,
      cabin_id: cabineSelecionada.value.id
    })

    mostrarToast(` Item adicionado ao carrinho com sucesso!`, 'success')
    fecharModal()

    // Recarrega as trips DEPOIS de fechar o modal, de forma assíncrona
    setTimeout(() => {
      store.dispatch('trips/fetchTrips').catch(err => {
        console.error('Erro ao recarregar trips:', err)
      })
    }, 100)
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error)
    mostrarToast('Erro ao adicionar ao carrinho. Tente novamente.', 'error')
  }
}

onMounted(async () => {
  // Carrega o carrinho primeiro para filtrar as passagens já adicionadas
  if (isAuthenticated.value) {
    try {
      await store.dispatch('cart/fetchCart')
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error)
    }
  }
  // Depois carrega as trips
  await store.dispatch('trips/fetchTrips')
})
</script>

<style scoped>
.passagens-container {
  min-height: 100vh;
  background: black;
  color: white;
  padding: 70px 40px 40px;
  font-family: Arial, Helvetica, sans-serif;
  position: relative;
  z-index: 10;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  border-bottom: 1px solid #333;
}

.logo {
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.icon-button:hover{
  background: rgba(255, 255, 255, 0.1);
}

.icon-button svg{
  width: 24px;
  height: 24px;
  color: white;
}

.usuario{
  cursor:pointer;
  font-weight:bold;
}
h2 {
  font-size: 20px;
  margin-bottom: 24px;
  color: white;
}

.mensagem {
  color: #888;
  text-align: center;
  padding: 40px 0;
  font-size: 16px;
}

.mensagem-erro {
  color: #f87171;
  background: #3b0000;
  border: 1px solid #f87171;
  border-radius: 8px;
  padding: 16px;
}

.lista-passagens {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.card-passagem {
  background: #111;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: border-color 0.2s;
}

.card-passagem:hover {
  border-color: #0ea5e9;
}

.btn-adicionar-mini {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #16a34a;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-left: auto;
}

.btn-adicionar-mini:hover {
  background: #16a34a;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
}

.btn-adicionar-mini svg {
  width: 20px;
  height: 20px;
}

.card-rota {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: bold;
  justify-content: space-between;
}

.seta {
  color: #0ea5e9;
}

.card-preco {
  font-size: 22px;
  font-weight: bold;
  color: #22c55e;
}

.card-detalhes {
  display: flex;
  gap: 20px;
  padding-top: 12px;
  border-top: 1px solid #333;
  font-size: 14px;
}

.detalhe {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detalhe-label {
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
}

/* Lista de Opções (igual ao modal de passagens aéreas) */
.lista-opcoes {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
}

.opcao-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  background: #252525;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.opcao-item:hover {
  border-color: #0ea5e9;
}

.opcao-item.selecionado {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 1px rgba(14, 165, 233, 0.3);
}

.opcao-item.indisponivel {
  opacity: 0.6;
  cursor: not-allowed;
}

.opcao-item input {
  margin-top: 4px;
}

.opcao-conteudo {
  flex: 1;
}

.opcao-topo {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  color: white;
}

.status {
  color: #10b981;
  font-size: 13px;
  font-weight: 600;
}

.status.off {
  color: #f87171;
}

.detalhes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.detalhe-box {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 12px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detalhe-box-label {
  color: #888;
  font-size: 12px;
  text-transform: uppercase;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 20px;
  padding: 40px;
  max-width: 800px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(14, 165, 233, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h3 {
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin: 0;
}

.btn-fechar {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.btn-fechar:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-fechar svg {
  width: 24px;
  height: 24px;
  color: white;
}

.viagem-info {
  background: #252525;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.viagem-info p {
  margin: 0;
  font-size: 16px;
  color: white;
}

.viagem-info .preco {
  font-size: 20px;
  font-weight: bold;
  color: #10b981;
  margin-top: 8px;
}

.item-detalhes-selecao {
  background: #252525;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid rgba(14, 165, 233, 0.25);
}

.item-detalhes-selecao h4 {
  margin: 0 0 12px;
  color: white;
  font-size: 16px;
}

/* Filtro de Tipos */
.filtro-classe {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.btn-classe {
  padding: 10px 20px;
  border: 2px solid #444;
  background: transparent;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-classe:hover {
  border-color: #666;
  background: rgba(255, 255, 255, 0.05);
}

.btn-classe.active {
  background: linear-gradient(135deg, #0284c7 0%, #075985 100%);
  border-color: #0284c7;
  color: white;
}

/* Grid de Cabines */
.loading,
.sem-assentos {
  text-align: center;
  padding: 40px;
  color: #888;
  font-size: 16px;
}

.cabines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
  background: #252525;
  border-radius: 8px;
}

.cabine {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  padding: 12px;
}

.cabine.disponivel {
  background: #2d3748;
  border-color: #4a5568;
}

.cabine.disponivel:hover {
  background: #4a5568;
  border-color: #0ea5e9;
  transform: scale(1.05);
}

.cabine.ocupado {
  background: #1a1a1a;
  color: #555;
  cursor: not-allowed;
  border-color: #333;
}

.cabine.selecionado {
  background: linear-gradient(135deg, #0284c7 0%, #075985 100%);
  border-color: #0284c7;
  color: white;
  transform: scale(1.1);
}

.cabine-numero {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}

.cabine-capacidade {
  font-size: 12px;
  opacity: 0.8;
}

/* Botões de Ação */
.modal-acoes {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancelar,
.btn-confirmar {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-cancelar {
  background: transparent;
  color: white;
  border: 2px solid #444;
}

.btn-cancelar:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: #666;
}

.btn-confirmar {
  background: linear-gradient(135deg, #0284c7 0%, #075985 100%);
  color: white;
  border: 2px solid #0284c7;
}

.btn-confirmar:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.4);
}

.btn-confirmar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
