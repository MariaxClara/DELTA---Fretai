<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="handleSubmit">
      <input type="text" v-model="formData.email" placeholder="Email" required />
      <input type="password" v-model="formData.password" placeholder="Senha" required />
      <button type="submit">ENTRAR</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import useLogin from '~/composables/UseLogin'

const { formData, handleSubmit } = useLogin()
</script>
