<template>
  <div class="app-container">
    <h1 class="text-center text-white">Bem-vindo ao FretAí</h1>
    <div class="button-group">
      <button @click="goToLogin" class="btn-motorista">Sou Motorista</button>
      <button class="btn-passageiro">Sou Passageiro</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToLogin() {
  router.push('/login')
}
</script>

<style scoped lang="css">
.app-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #007bff;
}

h1 {
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
}

.btn-motorista {
  background-color: #ffffff;
  color: #007bff;
}

.btn-passageiro {
  background-color: #ffffff;
  color: #007bff;
}
</style>
