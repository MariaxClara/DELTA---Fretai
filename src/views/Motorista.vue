<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="fetchDriverInfo"> 
      <h1 class="title">Informações do Motorista</h1>

      <input 
        v-model="email" 
        placeholder="Digite o e-mail do motorista"
      >

      <button @click="fetchDriverInfo" class="buscar-btn">Buscar</button>

      <div v-if="driver" class="dados">
        <div class="photo-container">
          <img :src="driverImagePath" alt="Motorista" class="motorista-photo">
        </div>

        <p><strong>Nome:</strong> {{ driver.nome }}</p>
        <p><strong>Email:</strong> {{ driver.email }}</p>
        <p><strong>Telefone:</strong> {{ driver.telefone }}</p>

        <!-- Botão de troca de senha -->
        <button @click="goToTrocaSenha" class="buscar-btn">Trocar Senha</button>
      </div>
      <p v-else-if="error">{{ error }}</p>
    </form>
  </div>
  <div class="bottom-section"></div>
</template>

<script>
    export	default {
        name: 'Motorista',
    }
</script>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import '../assets/css/cssPerfilMotorista.css';

  const {VITE_BASE_URL_BACKEND} = import.meta.env
  console.log('URL Base do Backend:', VITE_BASE_URL_BACKEND);

  const email = ref('');
  const driver = ref(null);
  const driverImagePath = ref(''); // Caminho da imagem do motorista
  const error = ref(null);


  async function fetchDriverInfo() {
    try {
      console.log("URL da requisição:", `${VITE_BASE_URL_BACKEND}/driverInfo/${email.value}`);
      console.log(email.value);

      const response = await fetch(`${VITE_BASE_URL_BACKEND}/driverInfo/${email.value}`);
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
      const response = await fetch(`${VITE_BASE_URL_BACKEND}/imagePath/${email.value}`);
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
      driverImagePath.value = '/images/motorista1.png'; // Define um valor padrão se houver erro
    }
  }

  function goToTrocaSenha() {
    router.push({ 
      path: '/trocaSenha', 
      query: { email: driver.value.email, flag: 1 } 
    });
  }
</script>
