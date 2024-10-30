<!-- pages/driverInfo.vue -->
<template>
  <div>
    <h1>Informações do Motorista</h1>
    <input v-model="email" placeholder="Digite o email do motorista" />
    <button @click="fetchDriverInfo">Buscar</button>

    <div v-if="driver">
      <p><strong>Nome:</strong> {{ driver.nome }}</p>
      <p><strong>Email:</strong> {{ driver.email }}</p>
      <p><strong>Telefone:</strong> {{ driver.telefone }}</p>
    </div>
    <p v-else-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const driver = ref(null);
const error = ref(null);

async function fetchDriverInfo() {
  try {
    const response = await fetch(`/api/driverInfo?email=${email.value}`);
    const data = await response.json(); // Converte a resposta em JSON
    
    if (data.statusCode !== 200) {
      console.error("Erro na resposta da API:", data.body.error || 'Erro desconhecido');
      error.value = data.body.error || 'Erro desconhecido';
      return;
    }
    
    // Acessa o `body` diretamente para obter os dados do motorista
    driver.value = data.body;
    error.value = null; // Limpa o erro se a requisição for bem-sucedida
    console.log("Dados do motorista recebidos:", driver.value); // Exibe os dados do motorista no console
  } catch (err) {
    error.value = err.message;
    console.error("Erro ao buscar informações do motorista:", err.message);
  }
}
</script>
