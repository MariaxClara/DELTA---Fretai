<template>
  <div class="login-container">
    <h1 class="title">Informações do Passageiro</h1>

    <div v-if="passengerInfo" class="dados">
      <div class="photo-container">
        <!-- Usa a variável reativa 'passengerImagePath' como src -->
        <img :src="passengerImagePath" alt="Passageiro" class="motorista-photo">
      </div>
      
      <p><strong>Nome:</strong> {{ passengerInfo.passageiro_nome }}</p>
      <p><strong>Email:</strong> {{ passengerInfo.passageiro_email }}</p>
      <p><strong>Telefone:</strong> {{ passengerInfo.passageiro_telefone }}</p>


      <button @click="goToTrocaSenha" class="trocar-senha-btn">Trocar Senha</button>
    </div>
    
    <p v-else-if="error" class="error">{{ error }}</p>
  </div>
  <div class="bottom-section"></div>
</template>

<script>
  export default {
    name: 'Passageiro',
  };
</script>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import '../assets/css/cssPerfilMotorista.css';

const passengerInfo = ref(null);
const passengerImagePath = ref('/images/user-placeholder.png'); // Caminho padrão para a imagem
const error = ref(null);
const router = useRouter();

const getCookie = (name) => {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find((c) => c.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
};

const userEmail = getCookie('userEmail');
console.log('User Email:', userEmail);

async function fetchPassengerInfo() {
  try {
    const response = await fetch(`http://localhost:3000/passengerInfo/${userEmail}`);
    const data = await response.json();

    if (data.statusCode !== 200) {
      error.value = data.body.error || 'Erro desconhecido';
      return;
    }

    if (data.body.length > 0) {
      const firstPassenger = data.body[0];
      passengerInfo.value = {
        passageiro_nome: firstPassenger.passageiro_nome,
        passageiro_email: firstPassenger.passageiro_email,
        passageiro_telefone: firstPassenger.passageiro_telefone,
        
      };

      // Atualiza o caminho da imagem do passageiro
      await getImage(userEmail);
    } else {
      passengerInfo.value = null;
    }
    error.value = null;
  } catch (err) {
    error.value = err.message;
  }
}

async function getImage(userEmail) {
  try {
    const response = await fetch(`http://localhost:3000/imagePath/${userEmail}`);
    const data = await response.json();

    if (data.statusCode !== 200) {
      console.error('Erro ao buscar a imagem do passageiro:', data.body.error || 'Erro desconhecido');
      passengerImagePath.value = '/images/user-placeholder.png'; // Define uma imagem padrão
      return;
    }

    // Atualiza o caminho da imagem do passageiro
    passengerImagePath.value = data.body.imagePath;
  } catch (err) {
    console.error('Erro ao buscar o caminho da imagem:', err.message);
    passengerImagePath.value = '/images/user-placeholder.png'; // Define uma imagem padrão em caso de erro
  }
}

function goToTrocaSenha() {
  if (!userEmail) {
    error.value = 'Não foi possível encontrar o email do passageiro.';
    return;
  }

  router.push({
    path: '/trocaSenha',
    query: { email: userEmail, flag: 1 },
  });
}

// Chama as funções automaticamente ao carregar a página
onMounted(() => {
  if (userEmail) {
    fetchPassengerInfo();
  } else {
    error.value = 'Email do usuário não encontrado nos cookies.';
    console.error('Email do usuário não encontrado nos cookies.');
  }
});
</script>

<style>  
.trocar-senha-btn {
  background-color: #007bff; 
  color: #fff; 
  font-size: 16px; 
  font-weight: bold; 
  padding: 12px 20px; 
  border: none; 
  border-radius: 8px; 
  cursor: pointer; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
  transition: background-color 0.3s ease, transform 0.2s ease; 
}

.trocar-senha-btn:hover {
  background-color: #0056b3; 
  transform: translateY(-2px); 
}

.trocar-senha-btn:active {
  background-color: #003f7f; 
  transform: translateY(1px); 
}
</style>