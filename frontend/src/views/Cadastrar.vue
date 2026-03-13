<template>
  <div class="container">
    <main class="register-box">

      <h2>Criar conta</h2>
      <p class="subtitle">
        Cadastre-se e encontre as passagens mais baratas entre todas as companhias.
      </p>

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

        <button type="submit" class="register-button">
          Cadastrar
        </button>

      </form>

      <p class="login-link">
        Já possui conta?
        <a @click.prevent="irLogin" href="#">Entrar</a>
      </p>

    </main>

  </div>
</template>

<script>
import { useRouter } from "vue-router"

export default {
  data() {
    return {
      nome: "",
      email: "",
      cpf: "",
      senha: ""
    }
  },
  methods: {

    irLogin() {
      this.$router.push('/login')
    },

    cadastrar() {
      const usuario = {
        nome: this.nome,
        email: this.email,
        cpf: this.cpf,
        senha: this.senha
      }

      console.log("Dados do cadastro:", usuario)

      alert("Cadastro realizado com sucesso!")
    }
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

.login-link{
  margin-top:15px;
  font-size:14px;
  text-align:center;
  color:black
}

.login-link a{
  color:#3b82f6;
  text-decoration:none;
}

</style>