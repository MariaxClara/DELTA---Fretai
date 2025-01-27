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
        <button class="botao" @click="fetchRaceInfo">
          <img src="/images/UserCircle.svg" alt="" />
          <i class="icon-bus"></i>
          Motoristas
        </button>
      </div>
    </div>
    
    <!-- Informações da Corrida -->
    <div class="dados-container">
      <p v-if="isLoading">Carregando informações...</p>
      <div v-else-if="corridaInfo && corridaInfo.length > 0" class="dados">
        <h2>Informações da Corrida:</h2>
        <div v-for="(corrida, index) in corridaInfo" :key="index" class="corrida-detalhes">
          <p><strong>Motorista:</strong> {{ corrida.motorista_nome }}</p>
          <p><strong>Telefone Motorista:</strong> {{ corrida.motorista_telefone }}</p>
          <p><strong>Destino:</strong> {{ corrida.destino }}</p>
          <p><strong>Horário:</strong> {{ corrida.horario }}</p>
          <p><strong>Dia da Semana:</strong> {{ corrida.dia_da_semana }}</p>
          <p><strong>Status corrida:</strong> {{ corrida.status_corrida }}</p>
          <p><strong>Id rota:</strong> {{ corrida.rota_id }}</p>
          <p v-if="corrida.isCanceled" class="cancelado-msg">
            <strong>Status:</strong> Corrida cancelada.
          </p>
          <button
            v-else
            type="button"
            class="cancelar-btn"
            @click="showPopupWithType(index, corrida.status_corrida)"
          >
            Cancelar corrida
          </button>
          <hr />
        </div>
      </div>
      <div v-else-if="!isLoading && corridaInfo && corridaInfo.length === 0">
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
  const showPopup = ref(false);
  const popupType = ref(null);
  const selectedRaceIndex = ref(null);
  
  popupType.value = 0;
  
  async function fetchRaceInfo() {
    isLoading.value = true;
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
  
  function showPopupWithType(index, type) {
    selectedRaceIndex.value = index;
    popupType.value = type;
    showPopup.value = true;
  }
  
  function closePopup() {
    showPopup.value = false;
    popupType.value = null;
    selectedRaceIndex.value = null;
  }
  
  async function cancelRace() {
    if (selectedRaceIndex.value !== null) {
      const selectedRace = corridaInfo.value[selectedRaceIndex.value];
      const { rota_id, passageiro_id } = selectedRace;
      const status_corrida = -1;
      try {
        const response = await fetch(`${VITE_BASE_URL_BACKEND}/changeRacePassengerStatus/${rota_id}/${passageiro_id}/${status_corrida}`);
        if (!response.ok) throw new Error("Erro ao atualizar o status");
        fetchRaceInfo();
      } catch (err) {
        console.error(err);
      }
    }
    closePopup();
  }
  
  function redirectToChatBot() {
    window.location.href = "http://localhost:5173/ChatBot";
  }
  </script>
  
  <style src="../assets/css/home.css"></style>
  