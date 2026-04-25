<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function irHome() {
  router.push('/')
}

function irUsuario() {
  router.push('/usuario')
}

function verPedidos() {
  router.push('/pedidos')
}
</script>

<template>
  <div class="sucesso">

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
      
      <!-- Ícone sucesso -->
      <div class="check">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 12-12-1.5-1.5z"/>
        </svg>
      </div>

      <h2>Pagamento realizado com sucesso!</h2>
      <button class="botao" @click="verPedidos">
        Ver meus pedidos
      </button>

      <button class="secundario" @click="irHome">
        Voltar para o início
      </button>

    </main>

  </div>
</template>

<style scoped>
.sucesso{
  min-height:100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  color:white;
  display:flex;
  flex-direction:column;
  font-family:Arial, Helvetica, sans-serif;
}

/* NAVBAR (mesma da outra tela) */

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
}

/* CONTEÚDO */

.conteudo{
  flex:1;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  gap: 20px;
  padding: 40px;
  text-align: center;
}

h2{
  font-size: 26px;
  color: white;
}

.descricao{
  color: rgba(255,255,255,0.7);
  font-size: 16px;
}

/* ÍCONE CHECK */

.check{
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display:flex;
  align-items:center;
  justify-content:center;
  background: linear-gradient(135deg, #00c853, #69f0ae);
  box-shadow: 0 0 25px rgba(0, 200, 83, 0.6);
  animation: pop 0.4s ease;
}

.check svg{
  width: 50px;
  height: 50px;
  color: white;
}

@keyframes pop{
  0%{
    transform: scale(0.5);
    opacity:0;
  }
  100%{
    transform: scale(1);
    opacity:1;
  }
}

/* BOTÕES */

.botao{
  margin-top: 10px;
  padding: 18px 40px;
  border:none;
  border-radius: 12px;
  font-size:16px;
  font-weight:600;
  cursor:pointer;

  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color:white;

  transition:0.3s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.botao:hover{
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.secundario{
  background: transparent;
  border:none;
  color: rgba(255,255,255,0.6);
  cursor:pointer;
  transition:0.2s;
}

.secundario:hover{
  color:white;
}
</style>