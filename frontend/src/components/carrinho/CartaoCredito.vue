<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const numero = ref('')
const nome = ref('')
const validade = ref('')
const cvv = ref('')

function voltar() {
  router.push('/pagamento')
}

function irUsuario() {
  router.push('/usuario')
}

function irHome() {
  router.push('/')
}

function pagar() {
  if (!numero.value || !nome.value || !validade.value || !cvv.value) {
    alert('Preencha todos os campos')
    return
  }

  alert('Pagamento realizado com sucesso!')
}
</script>

<template>
  <div class="pagamento">

    <!-- NAVBAR -->
    <header class="navbar">
      <div class="logo" @click="irHome">-Horas</div>
    </header>

    <!-- CONTEÚDO -->
    <main class="conteudo">

      <h2>Pagamento com Cartão</h2>

      <div class="formulario">
        <input v-model="numero" type="text" placeholder="Número do cartão" />
        <input v-model="nome" type="text" placeholder="Nome no cartão" />

        <div class="linha">
          <input v-model="validade" type="text" placeholder="Validade (MM/AA)" />
          <input v-model="cvv" type="text" placeholder="CVV" />
        </div>

        <button class="botao" @click="pagar">
          Finalizar Pagamento
        </button>

        <button class="voltar" @click="voltar">
          Voltar
        </button>
      </div>

    </main>

  </div>
</template>

<style scoped>
.pagamento{
  min-height:100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  color:white;
  display:flex;
  flex-direction:column;
  font-family:Arial, Helvetica, sans-serif;
}

/* NAVBAR */

.navbar{
  position: relative;
  z-index: 100;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding: 20px 40px;
  border-bottom:1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.logo{
  font-size: 32px;
  font-weight: bold;
  cursor: pointer;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
  transition: 0.3s;
}

.logo:hover{
  transform: scale(1.05);
  filter: brightness(1.2);
}

.nav-icons{
  display: flex;
  align-items: center;
}

.usuario{
  cursor: pointer;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: 0.3s;
}

.usuario:hover{
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* CONTEÚDO */

.conteudo{
  flex:1;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  gap: 30px;
  padding: 40px;
}

h2{
  font-size: 22px;
  color: rgba(255,255,255,0.9);
}

/* FORM */

.formulario{
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 400px;
}

input{
  padding: 14px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  color: white;
  font-size: 14px;
  transition: 0.3s;
}

input:focus{
  outline: none;
  border-color: rgba(102,126,234,0.7);
  background: rgba(102,126,234,0.05);
  box-shadow: 0 0 10px rgba(102,126,234,0.3);
}

.linha{
  display:flex;
  gap: 10px;
}

/* BOTÃO PRINCIPAL */

.botao{
  margin-top: 10px;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.botao::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.botao:hover::before {
  left: 100%;
}

.botao:hover{
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

/* BOTÃO VOLTAR */

.voltar{
  margin-top: 5px;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  transition: 0.2s;
}

.voltar:hover{
  color: white;
}
</style>