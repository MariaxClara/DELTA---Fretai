<template>
    <div class="tela-inicial">
      <!-- Cabeçalho -->
      <header class="header">
        <img src="/images/iconeImage.png" alt="Logo" class="logo" />
        <h1>FretAí</h1>
      </header>
  
      <!-- Botões -->
      <div class="participantes">
        <button class="botao">
          <i class="icon-user"></i>
          <img src="/images/van.svg" alt="" />
          Perfil
        </button>
        <button class="botao" @click="toggleDriverList">
          <img src="/images/UserCircle.svg" alt="" />
          <i class="icon-bus"></i>
          Motoristas
        </button>
      </div>
    </div>
  
    <!-- Informações da Corrida -->
    <div class="dados-container">
      <p v-if="isLoading">Carregando informações...</p>
      <div v-if="showDrivers && corridaInfo && corridaInfo.length > 0">
        <div v-for="(corrida, index) in corridaInfo" :key="index" class="corrida-detalhes">
          {{ corrida.motorista_nome }}
          <img
            :src="driverImages[corrida.motorista_email] || '/images/user.png'"
            alt="Motorista"
            class="motorista-photo"
          />
          <button class="botaoMotoristas">
            <p>{{ corrida.motorista_nome }}</p>
          </button>
          <hr />
        </div>
      </div>
      <div v-else-if="showDrivers && searchInitiated && !isLoading && corridaInfo.length === 0">
        <p>Nenhuma corrida encontrada para o passageiro.</p>
      </div>
      <p v-else-if="error" class="error">{{ error }}</p>
    </div>
  
    <!-- Pop-ups dinâmicos -->
    <div v-if="showPopup" class="popup-overlay" @click.self="closePopup">
      <div class="popup">
        <template v-if="popupType === 0">
          <h2>Cancelar Corrida</h2>
          <p>Tem certeza que deseja cancelar a corrida?</p>
          <button @click="cancelRace" class="confirmar-btn">Sim</button>
          <button @click="closePopup" class="fechar-btn">Não</button>
        </template>
        <template v-else-if="popupType === 1">
          <h2>Aviso</h2>
          <p>Não é possível cancelar a corrida. A viagem já foi iniciada pelo motorista.</p>
        </template>
        <template v-else-if="popupType === 2">
          <h2>Aviso</h2>
          <p>Essa corrida já foi finalizada!</p>
        </template>
      </div>
    </div>
  
    <!-- Pop-up do Chat -->
    <div class="chat-popup" @click="redirectToChatBot">
      <p>Clique aqui para falar com nosso chat virtual</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const { VITE_BASE_URL_BACKEND } = import.meta.env;
  
  const email = ref("passageiro1@example.com");
  const corridaInfo = ref(null);
  const error = ref(null);
  const isLoading = ref(false);
  const selectedRaceIndex = ref(null);
  const searchInitiated = ref(false); // Flag para indicar se a busca foi iniciada
  const showDrivers = ref(false); // Flag para controlar a exibição da lista de motoristas
  
  async function fetchRaceInfo() {
    isLoading.value = true;
    searchInitiated.value = true;
    try {
      const response = await fetch(`${VITE_BASE_URL_BACKEND}/getRaceInfo/${email.value}`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data = await response.json();
      corridaInfo.value = data.raceInfo || [];
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }
  
  function redirectToChatBot() {
    window.location.href = "http://localhost:5173/ChatBot";
  }
  
  function toggleDriverList() {
    showDrivers.value = !showDrivers.value;
  }
  </script>
  
  <style src="../assets/css/home.css"></style>
  