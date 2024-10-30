<!-- pages/index.vue -->
<template>
  <div class="app-container">
    <div class="logo-container">
     <img src="~/public/images/iconeImage.png" alt="Van Logo" class="van-icon">
    </div>

    <div class="button-group">
      <button @click="goToLogin" class="btn-motorista">Sou Motorista</button>
      <button @click="goToLogin" class="btn-passageiro">Sou Passageiro</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import '@/assets/css/cssInicial.css'

const router = useRouter()

function goToLogin() {
  router.push('/login')
}
</script>

