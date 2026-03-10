<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function irCadastro() {
  router.push('/cadastro')
}

function irLogin() {
  router.push('/login')
}
</script>

<template>
<router-view />
  <div class="container">

    <header class="header">
      <div class="logo">-Horas</div>

      <nav class="auth-buttons">
        <button class="login" @click="irLogin">Entrar</button>
        <button class="register" @click="irCadastro">Cadastrar</button>
      </nav>
    </header>

    <main class="hero">
      <h1>-Horas</h1>

      <p class="subtitle">
        Compare passagens aéreas e marítimas entre todas as companhias
        e encontre sempre o melhor preço para a sua próxima viagem.
      </p>

      <button class="search-button" @click="buscarPassagens">
        Buscar passagens
      </button>
    </main>

  </div>
</template>

<style scoped>

.container{
  min-height:100vh;
  display:flex;
  flex-direction:column;
  font-family: Arial, Helvetica, sans-serif;
  background: linear-gradient(135deg,#0f172a,#1e293b);
  color:white;
}

.header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:20px 40px;
}

.logo{
  font-size:24px;
  font-weight:bold;
}

.auth-buttons{
  display:flex;
  gap:10px;
}

.auth-buttons button{
  padding:8px 16px;
  border-radius:6px;
  border:none;
  cursor:pointer;
  font-weight:600;
}

.login{
  background:transparent;
  border:1px solid white;
  color:white;
}

.register{
  background:#3b82f6;
  color:white;
}

.hero{
  flex:1;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  text-align:center;
  padding:20px;
}

.hero h1{
  font-size:56px;
  margin-bottom:10px;
}

.subtitle{
  max-width:600px;
  font-size:18px;
  opacity:0.9;
  margin-bottom:30px;
}

.search-button{
  padding:14px 28px;
  font-size:16px;
  border:none;
  border-radius:8px;
  background:#22c55e;
  color:white;
  cursor:pointer;
  font-weight:bold;
}

.search-button:hover{
  background:#16a34a;
}

</style>