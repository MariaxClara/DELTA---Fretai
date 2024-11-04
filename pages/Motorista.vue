<!-- pages/driverInfo.vue -->
<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="fetchDriverInfo"> 
      <h1 class="title">Informações do Motorista</h1>

      <input v-model="email" 
        placeholder="Digite o e-mail do motorista"
      >

      <button @click="fetchDriverInfo" class="cadastrar-btn">Buscar</button>

      <div v-if="driver" class="dados">
        <div class="photo-container">
          <img :src="driverImagePath" alt="Motorista" class="motorista-photo">
        </div>

        <p><strong>Nome:</strong> {{ driver.nome }}</p>
        <p><strong>Email:</strong> {{ driver.email }}</p>
        <p><strong>Telefone:</strong> {{ driver.telefone }}</p>
      </div>
      <p v-else-if="error">{{ error }}</p>
    </form>
  </div>
  <div class="bottom-section"></div>
</template>

<script setup>
import { ref } from 'vue';
import '~/assets/css/cssPerfilMotorista.css';

const email = ref('');
const driver = ref(null);
const driverImagePath = ref(''); // Caminho da imagem do motorista
const error = ref(null);

async function fetchDriverInfo() {
  try {
    const response = await fetch(`/api/driverInfo?email=${email.value}`);
    const data = await response.json();
    
    if (data.statusCode !== 200) {
      console.error("Erro na resposta da API:", data.body.error || 'Erro desconhecido');
      error.value = data.body.error || 'Erro desconhecido';
      return;
    }
    
    driver.value = data.body;
    error.value = null;

    // Chama a API para obter o caminho da imagem com base no email
    await fetchDriverImagePath();

    console.log("Dados do motorista recebidos:", driver.value);
  } catch (err) {
    error.value = err.message;
    console.error("Erro ao buscar informações do motorista:", err.message);
  }
}

async function fetchDriverImagePath() {
  try {
    const response = await fetch(`/api/getImagePath?email=${email.value}`);
    const data = await response.json();
    console.log(email.value);
    if (data.statusCode !== 200) {
      console.error("Erro ao buscar a imagem:", data.body.error || 'Erro desconhecido');
      driverImagePath.value = '/images/user.png'; // Define um valor padrão se a imagem não for encontrada
      return;
    }
    
    driverImagePath.value = data.body.imagePath;
  } catch (err) {
    console.error("Erro ao buscar o caminho da imagem:", err.message);
    driverImagePath.value = '/images/user.png'; // Define um valor padrão se houver erro
  }
}
</script>
