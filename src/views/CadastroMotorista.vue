<template>
  <div class="login-container">
    <!-- Logo e título -->
    <div class="logo-container">
      <img src="/images/iconeImage.png" alt="Van Logo" class="van-icon">
    </div>

    <!-- Formulário -->
    <form class="login-form" @submit.prevent="handleSubmit">
      <input 
        type="text"
        v-model="formData.nome"
        placeholder="Nome"
        required
      >

      <input 
        type="text"
        v-model="formData.cpf"
        placeholder="CPF"
        required
      >

      <input 
        type="text"
        v-model="formData.telefone"
        placeholder="Telefone"
        required
      >

      <input 
        type="text"
        v-model="formData.modelo_veiculo"
        placeholder="Modelo do veículo"
        required
      >

      <input 
        type="text"
        v-model="formData.placa_veiculo"
        placeholder="Placa do veículo"
        required
      >

      <input 
        type="email"
        v-model="formData.email"
        placeholder="E-mail"
        required
      >

      <input 
        type="password"
        v-model="formData.senha"
        placeholder="Senha"
        required
      >

      <button type="submit" class="cadastrar-btn">CADASTRAR</button>
    </form>

    <p v-if="confirmationMessage" class="confirmation-message">
      {{ confirmationMessage }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'CadastroMotorista',
};
</script>

<script setup>
import { useFormSetup } from '../composables/cadastroMotorista';

// Importação de dados do composable
const { formData, handleSubmit, confirmationMessage } = useFormSetup();
</script>
