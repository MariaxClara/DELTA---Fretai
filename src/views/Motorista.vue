<template>
  <div class="login-container">
    <h1 class="title">Informações do Motorista</h1>

    <div v-if="driver" class="dados">
      <div class="photo-container">
        <img :src="driverImagePath" alt="Motorista" class="motorista-photo">
      </div>

      <p><strong>Nome:</strong> {{ driver.nome }}</p>
      <p><strong>Email:</strong> {{ driver.email }}</p>
      <p><strong>Telefone:</strong> {{ driver.telefone }}</p>

      <!-- Botão de troca de senha -->
      <button @click="goToTrocaSenha" class="trocar-senha-btn">Trocar Senha</button>
    </div>
    <p v-else-if="error">{{ error }}</p>
  </div>
  <div class="bottom-section"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import '../assets/css/cssPerfilMotorista.css';

const { VITE_BASE_URL_BACKEND } = import.meta.env;

const driver = ref(null);
const driverImagePath = ref(''); // Caminho da imagem do motorista
const error = ref(null);

const router = useRouter();

const getCookie = (name) => {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find((c) => c.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
};

const userEmail = getCookie('userEmail');
console.log('User Email:', userEmail);

async function fetchDriverInfo() {
  try {
    const response = await fetch(`${VITE_BASE_URL_BACKEND}/driverInfo/${userEmail}`);
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
    const response = await fetch(`${VITE_BASE_URL_BACKEND}/imagePath/${userEmail}`);
    const data = await response.json();

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

function goToTrocaSenha() {
  router.push({
    path: '/trocaSenha',
    query: { email: driver.value.email, flag: 1 },
  });
}

// Chama a função `fetchDriverInfo` quando o componente é montado
onMounted(() => {
  if (userEmail) {
    fetchDriverInfo();
  } else {
    error.value = 'Email do usuário não encontrado nos cookies.';
    console.error("Email do usuário não encontrado nos cookies.");
  }
});
</script>
