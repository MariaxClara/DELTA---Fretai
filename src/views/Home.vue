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
          <img src="/images/van.svg" alt="" />
          Perfil
        </button>
        <button class="botao" @click="fetchRaceInfo">
          <img src="/images/UserCircle.svg" alt="" />
          Motoristas
        </button>
      </div>
    </div>
  
    <!-- Informações da Corrida -->
    <div class="dados-container">
      <!-- Mostrar carregando enquanto busca informações -->
      <p v-if="isLoading">Carregando informações...</p>
  
      <!-- Lista de corridas -->
      <div v-else-if="corridaInfo && corridaInfo.length > 0" class="dados">
        <h2>Informações da Corrida:</h2>
        <div v-for="(corrida, index) in corridaInfo" :key="index" class="corrida-detalhes">
          <button class="botao">
            <img :src="driverImages[corrida.motorista_email] || '/images/user.png'" alt="Motorista" class="motorista-photo">
            {{ corrida.motorista_nome }}
          </button>
          <hr />
        </div>
      </div>
  
      <!-- Nenhuma corrida encontrada -->
      <div v-else-if="!isLoading && corridaInfo && corridaInfo.length === 0">
        <p>Nenhuma corrida encontrada para o passageiro.</p>
      </div>
  
      <!-- Erro -->
      <p v-else-if="error" class="error">{{ error }}</p>
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
  
  // Função para buscar informações das corridas
  async function fetchRaceInfo() {
    isLoading.value = true;
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

<style src="../assets/css/home.css"></style>
 
<script>
  export default {
    name: "Home",
  };
</script>
