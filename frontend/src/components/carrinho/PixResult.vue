<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const qr = route.query.qr as string
const qrBase64 = route.query.qrBase64 as string
const ticket = route.query.ticket as string
</script>

<template>
  <div class="pagamento">
    <main class="conteudo">
      <h2>Pagamento via PIX</h2>

      <!-- QR CODE -->
      <div v-if="qrBase64">
        <img :src="`data:image/png;base64,${qrBase64}`" class="qr" />
      </div>

      <!-- COPIA E COLA -->
      <div v-if="qr" class="copiar">
        <label>Copiar código PIX:</label>
        <input :value="qr" readonly />
      </div>
    </main>
  </div>
</template>

<style scoped>
h2 {
  color: white;
}
.pagamento {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f, #1a1a1a);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.conteudo {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.qr {
  width: 250px;
  background: white;
  padding: 10px;
  border-radius: 10px;
}

.copiar input {
  width: 300px;
  padding: 10px;
  border-radius: 8px;
  border: none;
}

.botao {
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  color: white;
  text-decoration: none;
}
</style>