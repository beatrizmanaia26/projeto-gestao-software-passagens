<template>
  <div class="user-area-container">
    <div class="user-area-content">

      <div class="top-actions">
        <button class="btn-back" @click="voltarTelaAnterior" title="Voltar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
      </div>

      <!-- Header -->
      <div class="user-header">
        <div class="user-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
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
            <button class="btn-primary" @click="router.push('/home')">Comprar Passagens</button>
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

const voltarTelaAnterior = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.push('/home')
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
      router.push('/login')
    }
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error)
  }
})
</script>

<style scoped>
.user-area-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  padding: 2rem 1rem 3rem;
  font-family: Arial, Helvetica, sans-serif;
}

.user-area-content {
  max-width: 1200px;
  margin: 0 auto;
}

.top-actions {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1.5rem;
}

.btn-back {
  width: 52px;
  height: 52px;
  border: none;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.35);
  transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
}

.btn-back:hover {
  transform: translateY(-2px);
  filter: brightness(1.08);
  box-shadow: 0 14px 32px rgba(102, 126, 234, 0.45);
}

.btn-back svg {
  width: 24px;
  height: 24px;
}

.user-header {
  text-align: center;
  color: white;
  margin-bottom: 2.5rem;
}

.user-avatar {
  width: 110px;
  height: 110px;
  margin: 0 auto 1.5rem;
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
  box-shadow: 0 18px 50px rgba(102, 126, 234, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.14);
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
}

.user-subtitle {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.78);
  margin: 0;
}

.loading-state,
.info-card,
.tickets-card {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.24);
}

.loading-state {
  padding: 4rem 2rem;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #0ea5e9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #475569;
  font-size: 1.05rem;
}

.user-sections {
  display: grid;
  gap: 2rem;
}

.info-card,
.tickets-card {
  padding: 2rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.info-card:hover,
.tickets-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 55px rgba(0, 0, 0, 0.28);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-header svg {
  width: 28px;
  height: 28px;
  color: #667eea;
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #0f172a;
  font-weight: 700;
}

.btn-edit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-left: auto;
  box-shadow: 0 10px 24px rgba(102, 126, 234, 0.25);
}

.btn-edit:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 14px 28px rgba(102, 126, 234, 0.35);
}

.btn-edit svg {
  width: 20px;
  height: 20px;
  color: white;
}

.info-grid {
  display: grid;
  gap: 1.25rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-size: 0.82rem;
  font-weight: 700;
  color: #667eea;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.info-value,
.info-input {
  font-size: 1.05rem;
  color: #1e293b;
  padding: 1rem 1.1rem;
  background: #f8fafc;
  border-radius: 14px;
  border: 1px solid #e9d5ff;
}

.info-value {
  border-left: 4px solid #667eea;
}

.info-input {
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.info-input:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.12);
}

.edit-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel,
.btn-save,
.btn-primary {
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
}

.btn-cancel,
.btn-save {
  flex: 1;
  padding: 1rem;
}

.btn-cancel {
  background: #e2e8f0;
  color: #475569;
}

.btn-cancel:hover {
  filter: brightness(0.98);
}

.btn-save,
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.28);
}

.btn-save:hover,
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 30px rgba(102, 126, 234, 0.35);
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #64748b;
}

.empty-state svg {
  width: 80px;
  height: 80px;
  color: #94a3b8;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.05rem;
  margin-bottom: 1.5rem;
}

.btn-primary {
  padding: 1rem 2rem;
}

.tickets-list {
  display: grid;
  gap: 1.25rem;
}

.ticket-item {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 18px;
  padding: 1.5rem;
  border: 1px solid #ede9fe;
  transition: all 0.25s ease;
}

.ticket-item:hover {
  border-color: #667eea;
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.12);
}

.ticket-route {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px dashed #d8b4fe;
}

.route-point {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  flex: 1;
}

.route-label {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.route-city {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.route-arrow {
  flex-shrink: 0;
  margin: 0 1rem;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 10px 24px rgba(102, 126, 234, 0.22);
}

.route-arrow svg {
  width: 22px;
  height: 22px;
  color: white;
}

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
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #475569;
}

.detail-item svg {
  width: 18px;
  height: 18px;
  color: #667eea;
}

.detail-item.price {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  border: none;
  padding: 0.85rem 1.35rem;
  box-shadow: 0 12px 26px rgba(102, 126, 234, 0.24);
}

.price-value {
  font-size: 1.2rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .user-area-container {
    padding: 1.25rem 0.9rem 2rem;
  }

  .user-title {
    font-size: 2rem;
  }

  .user-subtitle {
    font-size: 0.95rem;
  }

  .info-card,
  .tickets-card,
  .loading-state {
    padding: 1.4rem;
  }

  .card-header {
    align-items: flex-start;
    gap: 0.75rem;
  }

  .ticket-route {
    flex-direction: column;
    gap: 1rem;
  }

  .route-arrow {
    transform: rotate(90deg);
    margin: 0.25rem 0;
  }

  .route-point {
    align-items: center;
    text-align: center;
  }

  .ticket-details,
  .edit-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
