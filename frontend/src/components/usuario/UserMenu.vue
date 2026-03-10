<template>
  <div class="container">

    <main class="login-box">

      <h2>Área do Cliente</h2>
      <p class="subtitle">
        Aqui estão seus dados e suas passagens compradas.
      </p>

      <div class="input-group">
        <label>Nome</label>
        <input type="text" v-model="nome" disabled />
      </div>

      <div class="input-group">
        <label>Email</label>
        <input type="email" v-model="email" disabled />
      </div>

      <div class="input-group">
        <label>CPF</label>
        <input type="text" v-model="cpf" disabled />
      </div>

      <div class="tickets">

        <h3>Passagens compradas</h3>

        <div v-if="passagens.length === 0">
          <p>Nenhuma passagem comprada.</p>
        </div>

        <ul v-else>
          <li v-for="(passagem,index) in passagens" :key="index">
            {{ passagem.origem }} → {{ passagem.destino }} | {{ passagem.data }}
          </li>
        </ul>

      </div>

    </main>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const nome = ref('')
const email = ref('')
const cpf = ref('')

const passagens = ref([])
</script>