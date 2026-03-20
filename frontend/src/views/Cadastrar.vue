<template>
  <div class="container">
    <main class="register-box">

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
            placeholder="Digite seu CPF"
            v-model="cpf"
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

function irLogin() {
  router.push('/login')
}

async function cadastrar() {
  // Limpar mensagens anteriores
  errorMessage.value = ''
  successMessage.value = ''

  // Validações básicas
  if (!nome.value || !email.value || !cpf.value || !senha.value) {
    errorMessage.value = 'Por favor, preencha todos os campos'
    return
  }

  if (senha.value.length < 6) {
    errorMessage.value = 'A senha deve ter pelo menos 6 caracteres'
    return
  }

  loading.value = true

  try {
    // Cadastrar usuário usando a store Vuex
    await store.dispatch('users/register', {
      name: nome.value,
      email: email.value,
      cpf: cpf.value,
      password: senha.value
    })

    successMessage.value = 'Cadastro realizado com sucesso! Redirecionando...'

    // Redirecionar para a home após 1.5 segundos
    setTimeout(() => {
      router.push('/home')
    }, 1500)

  } catch (error) {
    console.error('Erro no cadastro:', error)

    // Mensagem de erro mais específica
    errorMessage.value = error.response?.data?.error || 'Erro ao cadastrar. Tente novamente.'

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
  background:#3b82f6;
  color:white;
  font-weight:bold;
  cursor:pointer;
}

.register-button:hover{
  background:#2563eb;
}

.register-button:disabled{
  background:#94a3b8;
  cursor:not-allowed;
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