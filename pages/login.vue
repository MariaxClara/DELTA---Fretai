<template>
  <div class="login-container">
    <div class="logo-container">
      <img src="~/public/images/iconeImage.png" alt="Van Logo" class="van-icon">
    </div>

    <form class="login-form" @submit.prevent="handleSubmit">
      <input 
        type="text"
        v-model="formData.email"
        placeholder="Email"
        required
      >
      <input 
        type="password"
        v-model="formData.password"
        placeholder="Senha"
        required
      >
      <button type="submit" class="cadastrar-btn">ENTRAR</button>
    </form>

    <button 
      class="forgot-password-btn" 
      @click="showPasswordReset = true"
    >
      Esqueci minha senha
    </button>

    <!-- Modal para redefinir senha -->
    <PasswordResetModal
    v-if="showPasswordReset"
    :visible="showPasswordReset"
    :email="formData.email"
    @close="showPasswordReset = false"
    @passwordChanged="onPasswordChanged"
    />  

  </div>
</template>

<script setup lang="ts">
import useLogin from '@/composables/UseLogin'
import PasswordResetModal from '@/components/ResetarSenha.vue'
import '@/assets/css/cssCadastroMotorista.css'

const { formData, handleSubmit, showPasswordReset, onPasswordChanged } = useLogin()
</script>

<style scoped>
.forgot-password-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 10px;
}
.forgot-password-btn:hover {
  color: #0056b3;
}
</style>
