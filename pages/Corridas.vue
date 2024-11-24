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
import "~/assets/css/cssCorridas.css";

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
        const response = await fetch(`/api/raceInfo?email=${email.value}`);
        const data = await response.json();

        if (data.statusCode !== 200) {
            error.value = data.body.error || "Erro desconhecido";
            return;
        }

        if (data.body.length > 0) {
            // Popula corridaInfo
            corridaInfo.value = data.body.map((item) => ({
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

            // Atualiza o status de cada corrida
            await Promise.all(
                corridaInfo.value.map((_, index) => checkRaceStatus(index))
            );
        } else {
            corridaInfo.value = []; // Nenhuma corrida encontrada
        }

        error.value = null; // Limpa qualquer erro anterior
    } catch (err) {
        error.value = err.message;
        corridaInfo.value = []; // Limpa as informações da corrida caso ocorra um erro
    } finally {
        isLoading.value = false; // Desativa o carregamento
    }
}



// Função para verificar o status da corrida
async function checkRaceStatus(index) {
    try {
        const corrida = corridaInfo.value[index];
        if (!corrida) return;

        const statusResponse = await fetch(`/api/getRaceStatus?rota_id=${corrida.rota_id}`);
        if (!statusResponse.ok) {
            throw new Error("Erro ao verificar o status da corrida.");
        }

        const statusData = await statusResponse.json();
        // console.log("Status da corrida:", statusData);  
        if (statusData == -1) {
            console.log(`A corrida com rota_id ${corrida.rota_id} já está cancelada.`);
            corridaInfo.value[index].isCanceled = true; // Atualiza o estado da corrida
        } else {
            console.log(`A corrida com rota_id ${corrida.rota_id} não está cancelada.`);
            corridaInfo.value[index].isCanceled = false;
        }
    } catch (error) {
        console.error("Erro ao verificar o status da corrida:", error);
        throw error;
    }
}


// Exibir o pop-up com um tipo específico
function showPopupWithType(index, type) {
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

        try {
            // Atualiza o status da corrida no banco para -1 (cancelado)
            const response = await fetch("/api/changeRacePassengerStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rota_id: selectedRace.rota_id,
                    passageiro_id: selectedRace.passageiro_id,
                    status_corrida: -1, // Status cancelado
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao atualizar o status da corrida");
            }

            const result = await response.json();
            console.log("Corrida cancelada com sucesso:", result);

            // Atualiza o estado local no front-end
            selectedRace.status_corrida = -1;
            selectedRace.isCanceled = true;
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

  