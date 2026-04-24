<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function irParaCartao() {
  router.push('/pagamento/cartao')
}

function irParaPix() {
  router.push('/pagamento/pix')
}

function irUsuario() {
  router.push('/usuario')
}

function irHome() {
  router.push('/')
}
</script>

<template>
  <div class="pagamento">

    <!-- NAVBAR -->
    <header class="navbar">
      <div class="logo" @click="irHome">-Horas</div>

      <div class="nav-icons">
        <div class="usuario" @click="irUsuario">
          Usuario
        </div>
      </div>
    </header>

    <!-- CONTEÚDO -->
    <main class="conteudo">
      <h2>Escolha o método de pagamento</h2>

      <button class="botao" @click="irParaCartao">
        <!-- ícone cartão -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v2h20V6c0-1.1-.9-2-2-2zm0 6H2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8z"/>
        </svg>
        Cartão de Crédito
      </button>

      <button class="botao" @click="irParaPix">
        <!-- ícone PIX -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l4 4-4 4-4-4 4-4zm0 12l4 4-4 4-4-4 4-4z"/>
        </svg>
        PIX
      </button>
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
  margin-bottom: 10px;
  color: rgba(255,255,255,0.9);
}

/* BOTÕES */

.botao{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px 50px;
  border: none;
  border-radius: 15px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;

  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

  min-width: 280px;
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

.botao svg{
  width: 26px;
  height: 26px;
}

.botao:hover{
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.botao:active{
  transform: translateY(-1px);
}
</style>