<!-- Fretai/pages/MotoristaInfo.vue -->
<template>
  <div>
    <h1>Informações do Motorista</h1>
    <div v-if="motorista">
      <p><strong>Email:</strong> {{ motorista.emailUsuario }}</p>
      <p><strong>Nome:</strong> {{ motorista.nomeMotorista }}</p>
      <p><strong>Telefone:</strong> {{ motorista.telefoneMotorista }}</p>
      <p><strong>CPF:</strong> {{ motorista.cpfMotorista }}</p>
      <p><strong>Modelo do Veículo:</strong> {{ motorista.modeloVeiculo }}</p>
      <p><strong>Placa do Veículo:</strong> {{ motorista.placaVeiculo }}</p>
    </div>
    <div v-else-if="error">
      <p class="error">{{ error }}</p>
    </div>
    <div v-else>
      <p>Carregando informações do motorista...</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useFetch } from '#app'; // Importa a função useFetch do Nuxt

export default {
  name: 'MotoristaInfo',
  setup() {
    const motorista = ref(null);
    const error = ref(null);
    const emailProcurado = 'motorista1@example.com'; // Substitua pelo email desejado

    const fetchMotoristaInfo = async () => {
      try {
        const response = await useFetch(`/motorista?email=${emailProcurado}`);
        motorista.value = response.data.value; // Atualiza o motorista com os dados retornados
      } catch (err) {
        error.value = err.message;
      }
    };

    // Chama a função para buscar as informações do motorista ao montar o componente
    fetchMotoristaInfo();

    return {
      motorista,
      error,
    };
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
