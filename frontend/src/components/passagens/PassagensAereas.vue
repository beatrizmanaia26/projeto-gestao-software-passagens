<template>
  <div class="passagens-container">
   <header class="navbar">
      <div class="logo" @click="irHome">-Horas</div>

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
        @click="selecionada = selecionada?.id === passagem.id ? null : passagem"
      >
        <div class="card-rota">
          <span class="cidade">{{ passagem.origin }}</span>
          <span class="seta">→</span>
          <span class="cidade">{{ passagem.destination }}</span>
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const router = useRouter()

function irUsuario() {
  router.push('/usuario')
}
function irHome(){
  router.push('/home')
}
const store = useStore()
const selecionada = ref(null)

const loading = computed(() => store.state.trips.loading)
const error = computed(() => store.state.trips.error)
const passagens = computed(() => store.getters['trips/aerialTrips'])

function formatarData(datetime) {
  return new Date(datetime).toLocaleDateString('pt-BR')
}

function formatarHora(datetime) {
  return new Date(datetime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
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
  cursor: pointer;
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
  cursor: pointer;
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
</style>