<template>
  <div class="container">

    <main class="login-box">

      <h2>Entrar</h2>
      <p class="subtitle">
        Faça login para acessar suas passagens e ofertas mais baratas.
      </p>

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

async function logar() {
  if (!email.value || !senha.value) {
    alert('Por favor, preencha todos os campos')
    return
  }

  loading.value = true

  try {
    // Fazer login usando a store Vuex
    await store.dispatch('users/login', {
      email: email.value,
      password: senha.value
    })

    alert('Login realizado com sucesso!')
    router.push('/home')

  } catch (error) {
    console.error('Erro no login:', error)
    alert('Email ou senha incorretos')
  } finally {
    loading.value = false
  }
}

function irHome() {
  router.push('/home')
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
}

.login-box h2{
  margin-bottom:5px;
}

.subtitle{
  font-size:14px;
  color:#666;
  margin-bottom:20px;
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
  background:#3b82f6;
  color:white;
  font-weight:bold;
  cursor:pointer;
}

.login-button:hover{
  background:#2563eb;
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
