<template>
  <div class="container">
    <main class="register-box">

      <button class="btn-back" @click="voltarLanding" title="Voltar para página inicial">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>

      <h2>Criar conta</h2>
      <p class="subtitle">
        Cadastre-se e encontre as passagens mais baratas entre todas as companhias.
      </p>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <form @submit.prevent="cadastrar">

        <div class="input-group">
          <label>Nome</label>
          <input
            type="text"
            placeholder="Digite seu nome"
            v-model="nome"
            required
          />
        </div>

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
          <label>CPF</label>
          <input
            type="text"
            placeholder="000.000.000-00"
            v-model="cpf"
            @input="formatarCPF"
            maxlength="14"
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

        <button type="submit" class="register-button" :disabled="loading">
          {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
        </button>

      </form>

      <p class="login-link">
        Já possui conta?
        <a @click.prevent="irLogin" href="#">Entrar</a>
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

const nome = ref('')
const email = ref('')
const cpf = ref('')
const senha = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Função para voltar para a landing page
function voltarLanding() {
  router.push('/')
}

function irLogin() {
  router.push('/login')
}

// Função para validar email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Função para validar CPF
function validarCPF(cpf) {
  // Remove caracteres não numéricos
  const cpfLimpo = cpf.replace(/\D/g, '')

  // Verifica se tem 11 dígitos
  if (cpfLimpo.length !== 11) {
    return false
  }

  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    return false
  }

  return true
}

// Função para formatar CPF enquanto digita
function formatarCPF() {
  let valor = cpf.value.replace(/\D/g, '')

  if (valor.length <= 11) {
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    cpf.value = valor
  }
}

async function cadastrar() {
  // Limpar mensagens anteriores
  errorMessage.value = ''
  successMessage.value = ''

  // Validação: campos vazios
  if (!nome.value.trim()) {
    errorMessage.value = 'Por favor, preencha o nome'
    return
  }

  if (!email.value.trim()) {
    errorMessage.value = 'Por favor, preencha o email'
    return
  }

  if (!cpf.value.trim()) {
    errorMessage.value = 'Por favor, preencha o CPF'
    return
  }

  if (!senha.value) {
    errorMessage.value = 'Por favor, preencha a senha'
    return
  }

  // Validação: nome mínimo
  if (nome.value.trim().length < 3) {
    errorMessage.value = 'O nome deve ter pelo menos 3 caracteres'
    return
  }

  // Validação: formato de email
  if (!validarEmail(email.value)) {
    errorMessage.value = 'Formato de email inválido'
    return
  }

  // Validação: CPF
  if (!validarCPF(cpf.value)) {
    const cpfLimpo = cpf.value.replace(/\D/g, '')
    if (cpfLimpo.length !== 11) {
      errorMessage.value = `CPF com quantidade de dígitos inválida (${cpfLimpo.length}/11 dígitos)`
    } else {
      errorMessage.value = 'CPF inválido'
    }
    return
  }

  // Validação: senha
  if (senha.value.length < 6) {
    errorMessage.value = 'A senha deve ter pelo menos 6 caracteres'
    return
  }

  if (senha.value.length > 50) {
    errorMessage.value = 'A senha deve ter no máximo 50 caracteres'
    return
  }

  // Validação: senha forte (opcional, mas recomendado)
  if (!/[A-Za-z]/.test(senha.value) || !/[0-9]/.test(senha.value)) {
    errorMessage.value = 'A senha deve conter letras e números'
    return
  }

  loading.value = true

  try {
    // Cadastrar usuário usando a store Vuex
    await store.dispatch('users/register', {
      name: nome.value.trim(),
      email: email.value.trim().toLowerCase(),
      cpf: cpf.value.replace(/\D/g, ''), // Remove formatação
      password: senha.value
    })

    successMessage.value = 'Cadastro realizado com sucesso! Redirecionando...'

    // Redirecionar para a home após 1.5 segundos
    setTimeout(() => {
      router.push('/home')
    }, 1500)

  } catch (error) {
    console.error('Erro no cadastro:', error)

    // Mensagens de erro específicas
    if (error.response?.status === 409) {
      errorMessage.value = 'Email ou CPF já cadastrado'
    } else if (error.response?.data?.error) {
      errorMessage.value = error.response.data.error
    } else {
      errorMessage.value = 'Erro ao cadastrar. Verifique sua conexão e tente novamente.'
    }

  } finally {
    loading.value = false
  }
}
</script>

<style>
h2{
  color: black;
}
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

.register-box{
  background:white;
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

.register-box{
  background:white;
  padding:40px;
  border-radius:10px;
  width:350px;
  box-shadow:0 10px 30px rgba(0,0,0,0.2);
}

.register-box h2{
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

.register-button{
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

.register-button:hover{
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.register-button:disabled{
  background:#94a3b8;
  cursor:not-allowed;
  transform: none;
  box-shadow: none;
}

.login-link{
  margin-top:15px;
  font-size:14px;
  text-align:center;
  color:black
}

.login-link a{
  color:#3b82f6;
  text-decoration:none;
  cursor:pointer;
}

.login-link a:hover{
  text-decoration:underline;
}

</style>
