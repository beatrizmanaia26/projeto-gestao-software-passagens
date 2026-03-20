<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function irUsuario() {
  router.push('/usuario')
}

function passagensAereas() {
  console.log("Buscar passagens aéreas")
  router.push('/aereas')
}

function passagensMaritimas() {
  console.log("Buscar passagens marítimas")
  router.push('/maritimas')
}
</script>

<template>
  <div class="home">

    <!-- NAVBAR -->
    <header class="navbar">
      <div class="logo">-Horas</div>

      <div class="usuario" @click="irUsuario">
        Usuario
      </div>
    </header>

    <!-- CONTEÚDO CENTRAL -->
    <main class="conteudo">

      <button class="botao" @click="passagensAereas">
        Passagens Aéreas
      </button>

      <button class="botao" @click="passagensMaritimas">
        Passagens Marítimas
      </button>

    </main>

  </div>
</template>

<style scoped>

.home{
  min-height:100vh;
  background:black;
  color:white;
  display:flex;
  flex-direction:column;
  font-family:Arial, Helvetica, sans-serif;
  
}

/* NAVBAR */

.navbar{
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: black;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:35px 10px 10px;
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

/* CONTEÚDO */

.conteudo{
  flex:1;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  gap:20px;
}

.botao{
  padding:16px 32px;
  font-size:18px;
  border:none;
  border-radius:8px;
  cursor:pointer;
  background:#2563eb;
  color:white;
  font-weight:bold;
}

.botao:hover{
  background:#1d4ed8;
}

</style>