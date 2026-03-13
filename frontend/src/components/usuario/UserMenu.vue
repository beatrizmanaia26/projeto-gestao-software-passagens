<template>
  <div class="container">
    <main class="login-box">
      <h2>Área do Cliente</h2>
      <p class="subtitle">
        Aqui estão seus dados e suas passagens compradas.
      </p>

      <div v-if="loading">
        <p>Carregando dados...</p>
      </div>

      <div v-else-if="error">
        <p>Erro: {{ error }}</p>
      </div>

      <template v-else>
        <div class="input-group">
          <label>Nome</label>
          <input type="text" :value="name" disabled />
        </div>

        <div class="input-group">
          <label>Email</label>
          <input type="email" :value="email" disabled />
        </div>

        <div class="input-group">
          <label>CPF</label>
          <input type="text" :value="cpf" disabled />
        </div>

        <div class="tickets">
          <h3>Pedidos do cliente</h3>

          <div v-if="orders.length === 0">
            <p>Nenhum pedido encontrado.</p>
          </div>

          <ul v-else>
            <li v-for="order in orders" :key="order.id">
              Pedido #{{ order.id }} | Total: {{ order.total_amount }} | Status: {{ order.status }}
            </li>
          </ul>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const user = computed(() => store.getters['APImongoDB/user'])
const orders = computed(() => store.getters['APImongoDB/orders'])
const loading = computed(() => store.getters['APImongoDB/loading'])
const error = computed(() => store.getters['APImongoDB/error'])

const name = computed(() => user.value?.name || '')
const email = computed(() => user.value?.email || '')
const cpf = computed(() => user.value?.cpf || '')

onMounted(async () => {
  const userIdTeste = 'faf3c4b7-fbab-4688-8241-b46fd44b52ce'
  const userId = user.value?.id || userIdTeste

  await store.dispatch('APImongoDB/fetchUserById', userId)
  await store.dispatch('APImongoDB/fetchOrdersByUser', userId)
})
</script>