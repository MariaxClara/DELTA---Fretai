<!-- pages/motorista/login.vue -->
<template>
  <div class="login-container">
    <!-- Logo e título -->
    <div class="logo-container">
     <img src="~/public/images/iconeImage.png" alt="Van Logo" class="van-icon">
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
        v-model="formData.sobrenome"
        placeholder="Sobrenome"
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
        v-model="formData.placa"
        placeholder="Placa do veículo"
        required
      >

      <input 
        type="email"
        v-model="formData.email"
        placeholder="E-mail"
        required
      >

      <button type="submit" class="cadastrar-btn">CADASTRAR</button>
    </form>

    <p v-if="confirmationMessage" class="confirmation-message">
      {{ confirmationMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useFormSetup } from '@/composables/cadastroMotorista'
import '@/assets/css/cssCadastroMotorista.css'

const { formData, handleSubmit, confirmationMessage } = useFormSetup()
</script>
