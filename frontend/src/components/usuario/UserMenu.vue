<template>
  <div class="user-area-container">
    <div class="user-area-content">

      <!-- Header -->
      <div class="user-header">
        <div class="user-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </div>
        <h1 class="user-title">Área do Cliente</h1>
        <p class="user-subtitle">Visualize seus dados e passagens compradas</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Carregando seus dados...</p>
      </div>

      <!-- User Info Section -->
      <div v-else class="user-sections">

        <!-- Personal Info Card -->
        <div class="info-card">
          <div class="card-header">
            <div class="header-left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <h2>Meus Dados</h2>
            </div>
            <button class="btn-edit" @click="toggleEditMode" :title="editMode ? 'Cancelar' : 'Editar dados'">
              <svg v-if="!editMode" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <label>Nome Completo</label>
              <input
                v-if="editMode"
                v-model="editedNome"
                type="text"
                class="info-input"
                placeholder="Digite seu nome"
              />
              <div v-else class="info-value">{{ nome || 'Não informado' }}</div>
            </div>

            <div class="info-item">
              <label>E-mail</label>
              <input
                v-if="editMode"
                v-model="editedEmail"
                type="email"
                class="info-input"
                placeholder="Digite seu e-mail"
              />
              <div v-else class="info-value">{{ email || 'Não informado' }}</div>
            </div>

            <div class="info-item">
              <label>CPF</label>
              <div class="info-value">{{ formatCPF(cpf) || 'Não informado' }}</div>
            </div>
          </div>

          <div v-if="editMode" class="edit-actions">
            <button class="btn-cancel" @click="cancelEdit">Cancelar</button>
            <button class="btn-save" @click="saveChanges">Salvar Alterações</button>
          </div>
        </div>

        <!-- Tickets Card -->
        <div class="tickets-card">
          <div class="card-header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
            </svg>
            <h2>Minhas Passagens</h2>
          </div>

          <div v-if="passagens.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <p>Você ainda não possui passagens compradas</p>
            <button class="btn-primary" @click="$router.push('/')">Comprar Passagens</button>
          </div>

          <div v-else class="tickets-list">
            <div v-for="(passagem, index) in passagens" :key="index" class="ticket-item">
              <div class="ticket-route">
                <div class="route-point">
                  <span class="route-label">Origem</span>
                  <span class="route-city">{{ passagem.origem }}</span>
                </div>
                <div class="route-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                  </svg>
                </div>
                <div class="route-point">
                  <span class="route-label">Destino</span>
                  <span class="route-city">{{ passagem.destino }}</span>
                </div>
              </div>

              <div class="ticket-details">
                <div class="detail-item">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                  </svg>
                  <span>{{ passagem.data }}</span>
                </div>

                <div class="detail-item price">
                  <span class="price-value">R$ {{ passagem.valor?.toFixed(2) || '0.00' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

// Buscar dados do usuário da store
const nome = computed(() => store.getters['users/userName'])
const email = computed(() => store.getters['users/userEmail'])
const cpf = computed(() => store.state.users.currentUser?.cpf || '')

// Buscar pedidos do usuário
const orders = computed(() => store.state.orders.orders)
const loading = computed(() => store.state.users.loading || store.state.orders.loading)

// Formatar passagens para exibição
const passagens = computed(() => {
  return orders.value.map(order => ({
    origem: order.origin || 'N/A',
    destino: order.destination || 'N/A',
    data: order.created_at ? new Date(order.created_at).toLocaleDateString('pt-BR') : 'N/A',
    valor: order.total_amount
  }))
})

// Função para formatar CPF
const formatCPF = (cpf) => {
  if (!cpf) return ''
  const cleaned = cpf.replace(/\D/g, '')
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

// Estado de edição
const editMode = ref(false)
const editedNome = ref('')
const editedEmail = ref('')

// Alternar modo de edição
const toggleEditMode = () => {
  if (!editMode.value) {
    // Entrar no modo de edição - copiar valores atuais
    editedNome.value = nome.value || ''
    editedEmail.value = email.value || ''
  }
  editMode.value = !editMode.value
}

// Cancelar edição
const cancelEdit = () => {
  editMode.value = false
  editedNome.value = ''
  editedEmail.value = ''
}

// Salvar alterações
const saveChanges = async () => {
  try {
    const userId = store.getters['users/userId']

    if (!userId) {
      alert('Erro: Usuário não identificado')
      return
    }

    // Validações básicas
    if (!editedNome.value.trim()) {
      alert('Por favor, preencha o nome')
      return
    }

    if (!editedEmail.value.trim()) {
      alert('Por favor, preencha o e-mail')
      return
    }

    // Validar formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(editedEmail.value)) {
      alert('Por favor, insira um e-mail válido')
      return
    }

    // Atualizar dados via store
    await store.dispatch('users/updateUser', {
      id: userId,
      name: editedNome.value.trim(),
      email: editedEmail.value.trim()
    })

    alert('Dados atualizados com sucesso!')
    editMode.value = false
  } catch (error) {
    console.error('Erro ao salvar alterações:', error)
    alert('Erro ao salvar alterações. Tente novamente.')
  }
}

// Buscar dados quando o componente for montado
onMounted(async () => {
  try {
    const userId = store.getters['users/userId']

    if (userId) {
      await store.dispatch('users/fetchUserById', userId)
      await store.dispatch('orders/fetchUserOrders')
    } else {
      console.warn('Usuário não autenticado')
      router.push('/logar')
    }
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error)
  }
})
</script>

<style scoped>
/* Container Principal */
.user-area-container {
  min-height: 100vh;
  background: black;
  padding: 2rem 1rem;
}

.user-area-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.user-header {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.user-avatar {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  background: rgba(255, 255, 255, 0.2);
/* Header com botão de editar */
.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-edit {
  background: #667eea;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: auto;
}

.btn-edit:hover {
  background: #5568d3;
  transform: scale(1.1);
}

.btn-edit svg {
  width: 20px;
  height: 20px;
  color: white;
}

/* Input de edição */
.info-input {
  font-size: 1.1rem;
  color: #333;
  padding: 1rem;
  background: white;
  border: 2px solid #667eea;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.3s ease;
}

.info-input:focus {
  border-color: #5568d3;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Botões de ação de edição */
.edit-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f0f0f0;
}

.btn-cancel,
.btn-save {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #f0f0f0;
  color: #666;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.user-avatar svg {
  width: 60px;
  height: 60px;
  color: white;
}

.user-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.user-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

/* Loading State */
.loading-state {
  background: white;
  border-radius: 20px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #666;
  font-size: 1.1rem;
}

/* Sections */
.user-sections {
  display: grid;
  gap: 2rem;
}

/* Cards */
.info-card,
.tickets-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover,
.tickets-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.card-header svg {
  width: 32px;
  height: 32px;
  color: #667eea;
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  font-weight: 600;
}

/* Info Grid */
.info-grid {
  display: grid;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #667eea;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1.1rem;
  color: #333;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #666;
}

.empty-state svg {
  width: 80px;
  height: 80px;
  color: #ddd;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

/* Tickets List */
.tickets-list {
  display: grid;
  gap: 1.5rem;
}

.ticket-item {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 15px;
  padding: 1.5rem;
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;
}

.ticket-item:hover {
  border-color: #667eea;
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.1);
}

/* Route Display */
.ticket-route {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px dashed #e0e0e0;
}

.route-point {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.route-label {
  font-size: 0.75rem;
  color: #999;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.route-city {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
}

.route-arrow {
  flex-shrink: 0;
  margin: 0 1rem;
}

.route-arrow svg {
  width: 32px;
  height: 32px;
  color: #667eea;
}

/* Ticket Details */
.ticket-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #666;
}

.detail-item svg {
  width: 18px;
  height: 18px;
  color: #667eea;
}

.detail-item.price {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
}

.price-value {
  font-size: 1.25rem;
  font-weight: 700;
}

/* Responsive */
@media (max-width: 768px) {
  .user-title {
    font-size: 2rem;
  }

  .user-subtitle {
    font-size: 1rem;
  }

  .ticket-route {
    flex-direction: column;
    gap: 1rem;
  }

  .route-arrow {
    transform: rotate(90deg);
    margin: 0.5rem 0;
  }

  .route-point {
    align-items: center;
    text-align: center;
  }

  .ticket-details {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
