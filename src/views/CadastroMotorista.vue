<template>
  <div class="login-container">
    <div class="logo-container">
      <img src="/images/iconeImage.png" alt="Van Logo" class="van-icon">
    </div>

    <form class="login-form" @submit.prevent="handleSubmit">
      <input 
        type="text"
        v-model="formData.nome"
        placeholder="Nome"
        required
      />

      <input 
        type="text"
        v-model="formData.cpf"
        placeholder="CPF"
        required
      />

      <input 
        type="text"
        v-model="formData.telefone"
        placeholder="Telefone"
        required
      />

      <input 
        type="text"
        v-model="formData.modelo_veiculo"
        placeholder="Modelo do veículo"
        required
      />

      <input 
        type="text"
        v-model="formData.placa_veiculo"
        placeholder="Placa do veículo"
        required
      />

      <input 
        type="email"
        v-model="formData.email"
        placeholder="E-mail"
        required
      />

      <input 
        type="password"
        v-model="formData.senha"
        placeholder="Senha"
        required
      />

      <button type="submit" class="cadastrar-btn">CADASTRAR</button>
    </form>

    <p v-if="confirmationMessage" class="confirmation-message success">
      {{ confirmationMessage }}
    </p>
    <p v-if="errorMessage" class="confirmation-message error">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
import { useFormSetup } from '../composables/cadastroMotorista';

export default {
  name: 'CadastroMotorista',
  setup() {
    const { formData, handleSubmit, confirmationMessage, errorMessage } = useFormSetup();
    return { formData, handleSubmit, confirmationMessage, errorMessage };
  },
};
</script>

<style src="../assets/css/cssCadastroMotorista.css"></style>
