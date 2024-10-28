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
        type="email"
        v-model="formData.email"
        placeholder="E-mail"
        required
      >

      <input 
        type="text"
        v-model="formData.cpf"
        placeholder="CPF"
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
  </div>
</template>

<script setup>
import '@/assets/css/cssLogin.css'

const formData = ref({
  nome: '',
  sobrenome: '',
  email: '',
  cpf: '',
  senha: ''
})

const handleSubmit = async () => {
  try {
    console.log('Dados do formulário:', formData.value)
  } catch (error) {
    console.error('Erro ao cadastrar:', error)
  }
}
</script>