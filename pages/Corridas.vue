<template>
    <div class="corridas-container">
      <!-- Formulário Centralizado -->
      <div class="formulario">
        <form class="login-form" @submit.prevent="fetchRaceInfo">
          <h1 class="title">Informações da Corrida</h1>
          <input v-model="email" placeholder="Digite o e-mail do passageiro" />
          <button type="submit" class="buscar-btn">Buscar</button>
        </form>
      </div>
  
      <!-- Informações da Corrida -->
      <div class="dados-container">
        <div v-if="corridaInfo && corridaInfo.length > 0" class="dados">
          <h2>Informações da Corrida:</h2>
          <div v-for="(corrida, index) in corridaInfo" :key="index">
            <p><strong>Motorista:</strong> {{ corrida.motorista_nome }}</p>
            <p><strong>Telefone Motorista:</strong> {{ corrida.motorista_telefone }}</p>
            <p><strong>Passageiro:</strong> {{ corrida.passageiro_nome }}</p>
            <p><strong>Telefone Passageiro:</strong> {{ corrida.passageiro_telefone }}</p>
            <p><strong>Destino:</strong> {{ corrida.destino }}</p>
            <p><strong>Horário:</strong> {{ corrida.horario }}</p>
            <p><strong>Dia da Semana:</strong> {{ corrida.dia_da_semana }}</p>
            <button type="button" class="cancelar-btn" @click="openPopup(index)">Cancelar corrida</button>
            <hr />
          </div>
        </div>
  
        <!-- Caso nenhuma corrida seja encontrada -->
        <div v-else-if="corridaInfo && corridaInfo.length === 0">
          <p>Nenhuma corrida encontrada para o passageiro.</p>
        </div>
  
        <!-- Exibição de erros -->
        <p v-else-if="error" class="error">{{ error }}</p>
      </div>
  
      <!-- Pop-up cancelamento -->
      <div v-if="showPopup" class="popup-overlay" @click.self="closePopup">
        <div class="popup">
          <h2>Cancelar Corrida</h2>
          <p>Tem certeza que deseja cancelar a corrida?</p>
          <button @click="cancelRace" class="confirmar-btn">Sim</button>
          <button @click="closePopup" class="fechar-btn">Não</button>
        </div>
      </div>
    </div>
  </template>
  


<script setup>
import { ref } from 'vue';
import '~/assets/css/cssCorridas.css'; // Importando o CSS para este componente

// Dados reativos
const email = ref('');
const corridaInfo = ref(null);
const error = ref(null);
const showPopup = ref(false);
const selectedRaceIndex = ref(null); // Para armazenar a corrida selecionada

// Função para buscar as informações da corrida
async function fetchRaceInfo() {
    try {
        const response = await fetch(`/api/raceInfo?email=${email.value}`);
        const data = await response.json();

        if (data.statusCode !== 200) {
            error.value = data.body.error || 'Erro desconhecido';
            return;
        }

        // Verificar e processar os dados recebidos
        if (data.body.length > 0) {
            corridaInfo.value = data.body.map(item => ({
                motorista_nome: item.motorista_nome,
                motorista_telefone: item.motorista_telefone,
                passageiro_nome: item.passageiro_nome,
                passageiro_telefone: item.passageiro_telefone,
                destino: item.destino,
                horario: item.horario,
                dia_da_semana: item.dia_da_semana,
            }));
        } else {
            corridaInfo.value = []; // Nenhuma corrida encontrada
        }
        error.value = null; // Limpa qualquer erro anterior
    } catch (err) {
        error.value = err.message;
        corridaInfo.value = []; // Limpa as informações da corrida caso ocorra um erro
    }
}

// Abrir o pop-up ao clicar em "Cancelar Corrida"
function openPopup(index) {
    selectedRaceIndex.value = index; // Define o índice da corrida a ser cancelada
    showPopup.value = true; // Exibe o pop-up
}

// Fechar o pop-up
function closePopup() {
    showPopup.value = false;
    selectedRaceIndex.value = null; // Reseta o índice selecionado
}

// Cancelar corrida selecionada
function cancelRace() {
    if (selectedRaceIndex.value !== null && corridaInfo.value[selectedRaceIndex.value]) {
        // Remove a corrida do array
        corridaInfo.value.splice(selectedRaceIndex.value, 1);
        // Opcional: Enviar requisição para o backend informando o cancelamento
        console.log(`Corrida de índice ${selectedRaceIndex.value} cancelada`);
    }

    // Fecha o pop-up após cancelar
    closePopup();
}
</script>
