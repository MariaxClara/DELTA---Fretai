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
            <!-- Mostrar carregando enquanto busca informações -->
            <p v-if="isLoading">Carregando informações...</p>
  
            <div v-else-if="corridaInfo && corridaInfo.length > 0" class="dados">
                <h2>Informações da Corrida:</h2>
                <div v-for="(corrida, index) in corridaInfo" :key="index" class="corrida-detalhes">
                    <p><strong>Motorista:</strong> {{ corrida.motorista_nome }}</p>
                    <p><strong>Telefone Motorista:</strong> {{ corrida.motorista_telefone }}</p>
                    <p><strong>Passageiro:</strong> {{ corrida.passageiro_nome }}</p>
                    <p><strong>Telefone Passageiro:</strong> {{ corrida.passageiro_telefone }}</p>
                    <p><strong>Destino:</strong> {{ corrida.destino }}</p>
                    <p><strong>Horário:</strong> {{ corrida.horario }}</p>
                    <p><strong>Dia da Semana:</strong> {{ corrida.dia_da_semana }}</p>
                    <p><strong>Status corrida:</strong> {{ corrida.status_corrida }}</p>
                    <p><strong>Id rota:</strong> {{ corrida.rota_id }}</p>
  
                    <!-- Mostrar mensagem se a corrida foi cancelada -->
                    <p v-if="corrida.isCanceled" class="cancelado-msg">
                        <strong>Status:</strong> Corrida cancelada.
                    </p>
  
                    <!-- Mostrar botão apenas se a corrida não estiver cancelada -->
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
  
            <!-- Caso nenhuma corrida seja encontrada -->
            <div v-else-if="!isLoading && corridaInfo && corridaInfo.length === 0">
                <p>Nenhuma corrida encontrada para o passageiro.</p>
            </div>
  
            <!-- Exibição de erros -->
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
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import "../assets/css/cssCorridas.css";
  
  const { VITE_BASE_URL_BACKEND } = import.meta.env;
  
  // Dados reativos
  const email = ref("");
  const corridaInfo = ref(null);
  const error = ref(null);
  const isLoading = ref(false); // Indicador de carregamento
  const showPopup = ref(false);
  const popupType = ref(null); // Tipo de pop-up a ser exibido
  const selectedRaceIndex = ref(null); // Para armazenar a corrida selecionada
  
  popupType.value = 0; // Define o tipo do pop-up
  
  // Função para buscar as informações da corrida
  async function fetchRaceInfo() {
      isLoading.value = true; // Ativa o carregamento
      try {
          const response = await fetch(`${VITE_BASE_URL_BACKEND}/getRaceInfo/${email.value}`, {
              method: 'GET',
          });
  
          console.log("Resposta HTTP completa:", response);
  
          // Verifica se a resposta foi bem-sucedida
          if (!response.ok) {
              throw new Error(`Erro HTTP ao buscar informações da corrida. Status: ${response.status}`);
          }
  
          // Verifica se o conteúdo retornado é JSON
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
              const textResponse = await response.text();
              console.error("Resposta inesperada do servidor (não JSON):", textResponse);
              throw new Error("Resposta inesperada do servidor. Esperado JSON.");
          }
  
          // Processa o corpo da resposta como JSON
          const data = await response.json();
          console.log("Resposta completa do servidor (JSON):", data);
  
          // Valida o formato da resposta JSON
          if (!data || !data.raceInfo || !Array.isArray(data.raceInfo)) {
              throw new Error(`Resposta do backend em formato inesperado: ${JSON.stringify(data)}`);
          }
  
          // Processa as informações da corrida
          corridaInfo.value = data.raceInfo.map((item) => ({
              motorista_nome: item.motorista_nome,
              motorista_telefone: item.motorista_telefone,
              passageiro_nome: item.passageiro_nome,
              passageiro_telefone: item.passageiro_telefone,
              destino: item.destino,
              horario: item.horario,
              dia_da_semana: item.dia_da_semana,
              rota_id: item.rota_id,
              status_corrida: item.status_corrida,
              passageiro_id: item.passageiro_id,
              user_id: item.user_id,
              isCanceled: false, // Define inicialmente como não cancelada
          }));
  
          // Filtra as corridas com status cancelado
          corridaInfo.value = corridaInfo.value.filter(
              (corrida) => corrida.status_corrida !== -1
          );
  
          error.value = null; // Limpa qualquer erro anterior
      } catch (err) {
          console.error("Erro capturado ao buscar informações da corrida:", err.message);
          error.value = err.message;
          corridaInfo.value = []; // Limpa as informações da corrida caso ocorra um erro
      } finally {
          isLoading.value = false; // Desativa o carregamento
      }
  }
  
  // Exibir o pop-up com um tipo específico
  function showPopupWithType(index, type) {
      console.log("Exibindo pop-up:", index, type);
      selectedRaceIndex.value = index; // Define o índice da corrida
      popupType.value = type; // Define o tipo do pop-up
      showPopup.value = true; // Exibe o pop-up
  }
  
  // Fechar o pop-up
  function closePopup() {
      showPopup.value = false;
      popupType.value = null; // Reseta o tipo do pop-up
      selectedRaceIndex.value = null; // Reseta o índice selecionado
  }
  
  // Cancelar corrida selecionada
  async function cancelRace() {
      if (selectedRaceIndex.value !== null && corridaInfo.value[selectedRaceIndex.value]) {
          const selectedRace = corridaInfo.value[selectedRaceIndex.value];
  
          // Obtendo os dados necessários
          const { rota_id, passageiro_id } = selectedRace;
          const status_corrida = -1; // Status cancelado
  
          try {
              // Envia a requisição GET com os parâmetros na URL
              const response = await fetch(`${VITE_BASE_URL_BACKEND}/changeRacePassengerStatus/${rota_id}/${passageiro_id}/${status_corrida}`, {
                  method: 'GET', // Usando GET, como especificado
              });
  
              if (!response.ok) {
                  throw new Error("Erro ao atualizar o status da corrida");
              }
  
              const result = await response.json();
              console.log("Corrida cancelada com sucesso:", result);
  
              // Atualiza o estado local no front-end
              selectedRace.status_corrida = status_corrida;
              selectedRace.isCanceled = true;
  
              // Atualiza a lista de corridas
              fetchRaceInfo(); // Recarrega as corridas para refletir a alteração
          } catch (error) {
              console.error("Erro ao cancelar corrida:", error);
          }
      } else {
          console.error("Nenhuma corrida válida selecionada.");
      }
      // Fecha o pop-up
      closePopup();
  }
  </script>
  