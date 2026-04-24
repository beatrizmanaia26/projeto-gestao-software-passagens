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
  <div class="container">

    <main class="hero">
      <h1>-Horas</h1>

      <p class="subtitle">
        Compare passagens aéreas e marítimas entre todas as companhias
        e encontre sempre o melhor preço para a sua próxima viagem.
      </p>

      <nav class="auth-buttons">
        <button class="login" @click="irLogin">Entrar</button>
        <button class="register" @click="irCadastro">Cadastrar</button>
      </nav>
    </main>

  </div>
</template>

<style scoped>

.container{
  min-height:100vh;
  display:flex;
  flex-direction:column;
  font-family: Arial, Helvetica, sans-serif;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%);
  color:white;
  position: relative;
  overflow: hidden;
}

.container::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.auth-buttons{
  display:flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}

.auth-buttons button{
  padding: 14px 40px;
  border-radius: 12px;
  border:none;
  cursor:pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-width: 150px;
}

.auth-buttons button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.auth-buttons button:hover::before {
  left: 100%;
}

.login{
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
}

.login:hover{
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
}

.register{
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.register:hover{
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.hero{
  flex:1;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  text-align:center;
  padding: 40px 20px;
  position: relative;
  z-index: 10;
}

.hero h1{
  font-size: 80px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #667eea 50%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 3px;
  animation: fadeInUp 1s ease-out;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.subtitle{
  max-width: 700px;
  font-size: 22px;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 40px;
  animation: fadeInUp 1s ease-out 0.2s both;
  color: rgba(255, 255, 255, 0.9);
}

.search-button{
  padding: 18px 50px;
  font-size: 18px;
  border: none;
  border-radius: 15px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(34, 197, 94, 0.4);
  animation: fadeInUp 1s ease-out 0.4s both;
  position: relative;
  overflow: hidden;
}

.search-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.search-button:hover::before {
  left: 100%;
}

.search-button:hover{
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(34, 197, 94, 0.6);
}

.search-button:active{
  transform: translateY(-1px);
  box-shadow: 0 5px 20px rgba(34, 197, 94, 0.5);
}

/* Responsive */
@media (max-width: 768px) {
  .header {
    padding: 20px 30px;
  }

  .logo {
    font-size: 28px;
  }

  .hero h1 {
    font-size: 50px;
  }

  .subtitle {
    font-size: 18px;
    max-width: 90%;
  }

  .search-button {
    padding: 16px 40px;
    font-size: 16px;
  }
}

</style>
