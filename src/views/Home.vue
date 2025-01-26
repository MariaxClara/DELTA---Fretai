<template>
    <div class="tela-inicial">
      <!-- Cabeçalho -->
      <header class="header">
        <img src="/images/iconeImage.png" alt="Logo" class="logo" />
      </header>
  
      <!-- Botões -->
      <div class="participantes">
        <button class="botao">
          <img src="/images/van.svg" alt="" />
          Perfil
        </button>
        <button class="botao" @click="toggleDriverList">
          <img src="/images/UserCircle.svg" alt="" />
          Motoristas
        </button>
      </div>
      <!-- Informações da Corrida -->
      <div>
      <!-- Mostrar carregando enquanto busca informações -->
      <p v-if="isLoading">Carregando informações...</p>
  
      <!-- Lista de corridas -->
      <div v-if="showDrivers && corridaInfo && corridaInfo.length > 0" class="lista-motoristas">
          <div v-for="(corrida, index) in corridaInfo" :key="index" class="corrida-detalhes">
          <img :src="driverImages[corrida.motorista_email] " alt="Motorista" class="motorista-photo" />
          <button class="botaoMotoristas">
              <p>{{ corrida.motorista_nome }}</p>
          </button>
          </div>
      </div>
  
      <!-- Nenhuma corrida encontrada -->
      <div v-else-if="showDrivers && searchInitiated && !isLoading && corridaInfo.length === 0">
          <p>Nenhuma corrida encontrada para o passageiro.</p>
      </div>
  
      <!-- Erro -->
      <p v-else-if="error" class="error">{{ error }}</p>
      </div>
    </div>
  
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const { VITE_BASE_URL_BACKEND } = import.meta.env;
  
  // Variáveis reativas
  const email = ref("passageiro2@example.com"); // Substituir para uso com cookies
  const corridaInfo = ref([]);
  const driverImages = ref({});
  const error = ref(null);
  const isLoading = ref(false);
  const searchInitiated = ref(false); // Flag para indicar se a busca foi iniciada
  const showDrivers = ref(false); // Flag para controlar a exibição da lista de motoristas
  
  // Função para alternar a exibição da lista de motoristas
  function toggleDriverList() {
    if (!showDrivers.value) {
      fetchRaceInfo(); // Busca informações somente se os motoristas ainda não estão sendo exibidos
    }
    showDrivers.value = !showDrivers.value;
  }
  
  // Função para buscar informações das corridas
  async function fetchRaceInfo() {
    isLoading.value = true;
    searchInitiated.value = true; // Marca que a busca foi iniciada
    try {
      const response = await fetch(`${VITE_BASE_URL_BACKEND}/getDrivers/${email.value}`);
      if (!response.ok) throw new Error("Erro ao buscar informações dos motoristas.");
  
      const data = await response.json();
      if (!data || !data.raceInfo || !Array.isArray(data.raceInfo)) {
        throw new Error("Formato inválido de resposta do servidor.");
      }
  
      corridaInfo.value = data.raceInfo.map((item) => ({
        motorista_nome: item.motorista_nome,
        motorista_email: item.motorista_email,
      }));
  
      // Busca as imagens dos motoristas após carregar as corridas
      await fetchAllDriverImages();
    } catch (err) {
      error.value = err.message;
      corridaInfo.value = [];
    } finally {
      isLoading.value = false;
    }
  }
  
  // Função para buscar as imagens de todos os motoristas
  async function fetchAllDriverImages() {
    driverImages.value = {}; // Reseta as imagens
    for (const corrida of corridaInfo.value) {
      await fetchDriverImagePath(corrida.motorista_email);
    }
  }
  
  // Função para buscar a imagem de um motorista
  async function fetchDriverImagePath(driverEmail) {
    try {
      const response = await fetch(`${VITE_BASE_URL_BACKEND}/imagePath/${driverEmail}`);
      if (!response.ok) throw new Error("Erro ao buscar imagem do motorista.");
  
      const data = await response.json();
      if (data.statusCode !== 200 || !data.body?.imagePath) {
        driverImages.value[driverEmail] = "/images/user.png";
        return;
      }
  
      driverImages.value[driverEmail] = data.body.imagePath;
    } catch (err) {
      driverImages.value[driverEmail] = "/images/user.png"; // Imagem padrão em caso de erro
    }
  }
  </script>
  
  <style src="../assets/css/home.css"></style>
  
  <script>
  export default {
    name: "Home",
  };
  </script>
  