<template>
  <div class="tela-inicial">
    <!-- Cabeçalho -->
    <header class="header">
      <img src="/images/iconeImage.png" alt="Logo" class="logo" />
    </header>

    <!-- Botões -->
    <div class="participantes">
      <button class="botao" @click="PerfilPassageiro">
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
      <p v-if="isLoading">Carregando informações...</p>

      <!-- Lista de motoristas -->
      <div v-if="showDrivers && corridaInfo.length > 0" class="lista-motoristas">
        <div
          v-for="(corrida, index) in corridaInfo"
          :key="index"
          class="corrida-detalhes"
        >
          <img
            :src="driverImages[corrida.motorista_email]"
            alt="Motorista"
            class="motorista-photo"
          />
          <!-- Botão para acessar o chat com o motorista -->
          <button class="botaoMotoristas" @click="goToChat(corrida.motorista_id)">
            <p>{{ corrida.motorista_nome }}</p>
          </button>
        </div>
      </div>

      <div v-else-if="showDrivers && searchInitiated && !isLoading && corridaInfo.length === 0">
        <p>Nenhuma corrida encontrada para o passageiro.</p>
      </div>

      <p v-else-if="error" class="error">{{ error }}</p>
    </div>
  </div>

  <!-- Pop-up do Chat -->
  <div class="chat-popup" @click="redirectToChatBot">
    <p>Clique aqui para falar com nosso chat virtual</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const { VITE_BASE_URL_BACKEND } = import.meta.env;

// Função para obter cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(";").shift());
  }
  return null;
}

const email1 = getCookie("userEmail");
const userID = getCookie("userID");

// Variáveis reativas
const corridaInfo = ref([]);
const driverImages = ref({});
const error = ref(null);
const isLoading = ref(false);
const searchInitiated = ref(false);
const showDrivers = ref(false);

// Função para alternar a exibição da lista de motoristas
function toggleDriverList() {
  if (!showDrivers.value) {
    fetchRaceInfo();
  }
  showDrivers.value = !showDrivers.value;
}

// Função para buscar informações das corridas
async function fetchRaceInfo() {
  isLoading.value = true;
  searchInitiated.value = true;
  try {
    const response = await fetch(`${VITE_BASE_URL_BACKEND}/getDrivers/${email1}`);
    if (!response.ok) throw new Error("Erro ao buscar informações dos motoristas.");

    const data = await response.json();
    if (!data || !data.raceInfo || !Array.isArray(data.raceInfo)) {
      throw new Error("Formato inválido de resposta do servidor.");
    }

    corridaInfo.value = data.raceInfo.map((item) => ({
      motorista_nome: item.motorista_nome,
      motorista_email: item.motorista_email,
      motorista_id: item.motorista_id, // Certifique-se que está correto
    }));

    console.log("Motoristas encontrados:", corridaInfo.value);
    await fetchAllDriverImages();
  } catch (err) {
    error.value = err.message;
    corridaInfo.value = [];
  } finally {
    isLoading.value = false;
  }
}

// Função para buscar as imagens dos motoristas
async function fetchAllDriverImages() {
  driverImages.value = {};
  for (const corrida of corridaInfo.value) {
    await fetchDriverImagePath(corrida.motorista_email);
  }
}

// Redireciona para o perfil do passageiro
async function PerfilPassageiro() {
  router.push("/PerfilUsuario");
}

// Redireciona para o chat com o motorista selecionado
function goToChat(motoristaIdSelecionado) {
  router.push(`/chat/${userID}/${motoristaIdSelecionado}`);
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
    driverImages.value[driverEmail] = "/images/user.png";
  }
}

// Redireciona para o chat bot
function redirectToChatBot() {
  window.location.href = "http://localhost:5173/ChatBot";
}
</script>

<style src="../assets/css/home.css"></style>

<script>
export default {
  name: "Home",
};
</script>
