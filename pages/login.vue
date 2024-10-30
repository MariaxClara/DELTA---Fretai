<template>
  <div class="login-container">
    <div class="logo-container">
      <img src="~/public/images/iconeImage.png" alt="Van Logo" class="van-icon">
    </div>

    <form class="login-form" @submit.prevent="handleSubmit">
      <input 
        type="text"
        v-model="formData.nome"
        placeholder="Email"
        required
      >
      <input 
        type="text"
        v-model="formData.sobrenome"
        placeholder="Senha"
        required
      >
      <button type="submit" class="cadastrar-btn">ENTRAR</button>
    </form>

    <PasswordResetModal 
      v-if="showPasswordReset"
      :visible="showPasswordReset"
      :email="formData.nome"
      @close="showPasswordReset = false"
      @passwordChanged="onPasswordChanged"
    />
  </div>
</template>

<script setup lang="ts">
import { useLogin } from '@/composables/login'
import PasswordResetModal from '@/components/ResetarSenha.vue'
import '@/assets/css/cssCadastroMotorista.css'

const { formData, handleSubmit, showPasswordReset, onPasswordChanged } = useLogin()
</script>
