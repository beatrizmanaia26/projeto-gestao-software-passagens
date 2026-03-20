<template>
  <div class="passagens-container">
    <header class="navbar">
      <div class="logo">-Horas</div>

      <div class="usuario" @click="irUsuario">
        Usuario
      </div>
    </header>
 
    <h2>Passagens Aéreas ✈</h2>
 
    <div v-if="loading" class="mensagem">
      Carregando passagens...
    </div>
 
    <div v-else-if="error" class="mensagem-erro">
      {{ error }}
    </div>
 
    <div v-else-if="passagens.length === 0" class="mensagem">
      Nenhuma passagem aérea disponível no momento.
    </div>
 
    <div v-else class="lista-passagens">
      <div
        v-for="passagem in passagens"
        :key="passagem.id"
        class="card-passagem"
      >
        <div class="card-rota">
          <span class="cidade">{{ passagem.origin }}</span>
          <span class="seta">→</span>
          <span class="cidade">{{ passagem.destination }}</span>
        </div>
 
        <div class="card-preco">
          R$ {{ Number(passagem.price).toFixed(2) }}
        </div>
      </div>
    </div>
 
  </div>
</template>
 
<script setup lang ="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex' 
import { useRouter } from 'vue-router'

const router = useRouter()

function irUsuario() {
  router.push('/usuario')
}
const store = useStore()
 
const loading = computed(() => store.state.trips.loading)
const error = computed(() => store.state.trips.error)
const passagens = computed(() => store.getters['trips/aerialTrips'])
 
onMounted(async () => {
  await store.dispatch('trips/fetchTrips')
})
</script>
 
<style scoped>
.passagens-container {
  min-height: 100vh;
  background: black;
  color: white;
  padding: 70px 10px 10px;
  font-family: Arial, Helvetica, sans-serif;
  position: relative;
  z-index: 10;
}
.navbar{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:20px 40px;
  border-bottom:1px solid #333;

}
.logo{
  font-size:22px;
  font-weight:bold;
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
  border-color: #2563eb;
}
 
.card-rota {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: bold;
}
 
.seta {
  color: #2563eb;
}
 
.card-preco {
  font-size: 22px;
  font-weight: bold;
  color: #22c55e;
}
</style>