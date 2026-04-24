<template>
  <div class="container">

    <main class="login-box">

      <button class="btn-back" @click="voltarLanding" title="Voltar para página inicial">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>

      <h2>Entrar</h2>
      <p class="subtitle">
        Faça login para acessar suas passagens e ofertas mais baratas.
      </p>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <form @submit.prevent="logar">

        <div class="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Digite seu email"
            v-model="email"
            required
          />
        </div>

        <div class="input-group">
          <label>Senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            v-model="senha"
            required
          />
        </div>

        <button type="submit" class="login-button" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

      </form>

      <p class="register-link">
        Não possui conta?
        <a @click.prevent="irCadastro" href="#">Cadastrar</a>
      </p>

    </main>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const email = ref('')
const senha = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Função para voltar para a landing page
function voltarLanding() {
  router.push('/')
}

// Função para validar email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

async function logar() {
  // Limpar mensagens anteriores
  errorMessage.value = ''
  successMessage.value = ''

  // Validação: campos vazios
  if (!email.value.trim()) {
    errorMessage.value = 'Por favor, preencha o email'
    return
  }

  if (!senha.value) {
    errorMessage.value = 'Por favor, preencha a senha'
    return
  }

  // Validação: formato de email
  if (!validarEmail(email.value)) {
    errorMessage.value = 'Formato de email inválido'
    return
  }

  // Validação: senha mínima
  if (senha.value.length < 6) {
    errorMessage.value = 'A senha deve ter pelo menos 6 caracteres'
    return
  }

  loading.value = true

  try {
    // Fazer login usando a store Vuex
    await store.dispatch('users/login', {
      email: email.value.trim().toLowerCase(),
      password: senha.value
    })

    successMessage.value = 'Login realizado com sucesso! Redirecionando...'

    // Redirecionar após 1 segundo
    setTimeout(() => {
      router.push('/home')
    }, 1000)

  } catch (error) {
    console.error('Erro no login:', error)

    // Mensagens de erro específicas
    if (error.response?.status === 401) {
      errorMessage.value = 'Email ou senha incorretos'
    } else if (error.response?.status === 404) {
      errorMessage.value = 'Usuário não encontrado. Verifique o email digitado.'
    } else if (error.response?.data?.error) {
      errorMessage.value = error.response.data.error
    } else {
      errorMessage.value = 'Erro ao fazer login. Verifique sua conexão e tente novamente.'
    }
  } finally {
    loading.value = false
  }
}

function irCadastro() {
  router.push('/cadastro')
}
</script>

<style scoped>
.container{
  min-height:100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  background:linear-gradient(135deg,#0f172a,#1e293b);
  font-family:Arial, Helvetica, sans-serif;
}

.header{
  position:absolute;
  top:20px;
  left:30px;
  color:white;
}

.login-box{
  background:white;
  padding:40px;
  border-radius:10px;
  width:350px;
  box-shadow:0 10px 30px rgba(0,0,0,0.2);
  position: relative;
}

/* Botão Voltar */
.btn-back {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 15px;
  width: 36px;
  height: 36px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-back:hover {
  transform: translateX(-3px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-back svg {
  width: 20px;
  height: 20px;
}

.login-box h2{
  margin-bottom:5px;
}

.subtitle{
  font-size:14px;
  color:#666;
  margin-bottom:20px;
}

/* Mensagens de erro e sucesso */
.error-message {
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 14px;
  text-align: center;
}

.success-message {
  background-color: #efe;
  border: 1px solid #cfc;
  color: #3c3;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 14px;
  text-align: center;
}

.input-group{
  display:flex;
  flex-direction:column;
  margin-bottom:15px;
}

.input-group label{
  font-size:14px;
  margin-bottom:5px;
}

.input-group input{
  padding:10px;
  border-radius:6px;
  border:1px solid #ccc;
}

.login-button{
  width:100%;
  padding:12px;
  border:none;
  border-radius:6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color:white;
  font-weight:bold;
  cursor:pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.login-button:hover{
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.login-button:disabled{
  background:#94a3b8;
  cursor:not-allowed;
  transform: none;
  box-shadow: none;
}

.register-link{
  margin-top:15px;
  font-size:14px;
  text-align:center;
  color:black
}

.register-link a{
  color:#3b82f6;
  text-decoration:none;
  cursor:pointer;
}
</style>
