<template>
    <div class="login-container">
      <form class="login-form" @submit.prevent="fetchPassengerInfo"> 
        <h1 class="title">Informações do Passageiro</h1>
  
        <input 
          v-model="email" 
          placeholder="Digite o e-mail do passageiro"
        >
  
        <button type="submit" class="cadastrar-btn">Buscar</button>
  
        <div v-if="passengerInfo" class="dados">
          <div class="photo-container">
            <img src="/images/motoristaImage.png" alt="Passageiro" class="motorista-photo">
          </div>
          
          <p><strong>Nome:</strong> {{ passengerInfo.passageiro_nome }}</p>
          <p><strong>Email:</strong> {{ passengerInfo.passageiro_email }}</p>
          <p><strong>Telefone:</strong> {{ passengerInfo.passageiro_telefone }}</p>
  
          <h3>Motoristas Relacionados:</h3>
          <ul>
            <li v-for="motorista in passengerInfo.motoristas" :key="motorista.motorista_telefone">
              <p><strong>Nome:</strong> {{ motorista.motorista_nome }}</p>
              <p><strong>Telefone:</strong> {{ motorista.motorista_telefone }}</p>
            </li>
          </ul>
  
          <button @click="goToTrocaSenha" class="trocar-senha-btn">Trocar Senha</button>
        </div>
        
        <p v-else-if="error" class="error">{{ error }}</p>
      </form>
    </div>
    <div class="bottom-section"></div>
  </template>
  
<script>
    export default{
        name: 'Passageiro',
    }
</script>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import '../assets/css/cssPerfilMotorista.css';
  const {VITE_BASE_URL_BACKEND} = import.meta.env 
  
  const email = ref('');
  const passengerInfo = ref(null);
  const error = ref(null);
  const router = useRouter();
  
  async function fetchPassengerInfo() {
    try {
      const response = await fetch(`${VITE_BASE_URL_BACKEND}/driverInfo/${email.value}`);
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
          motoristas: data.body.map(item => ({
            motorista_nome: item.motorista_nome,
            motorista_telefone: item.motorista_telefone,
          })),
        };
      } else {
        passengerInfo.value = null;
      }
      error.value = null;
    } catch (err) {
      error.value = err.message;
    }
  }
  
  function goToTrocaSenha() {
    if (!passengerInfo.value || !passengerInfo.value.passageiro_email) {
      error.value = "Não foi possível encontrar o email do passageiro.";
      return;
    }
  
    router.push({
      path: '/trocaSenha',
      query: { email: passengerInfo.value.passageiro_email, flag: 1 }
    });
  }

</script>