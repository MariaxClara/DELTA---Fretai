<!-- components/PasswordResetModal.vue -->
<template>
    <div class="modal-overlay" v-if="visible" @click.self="closeModal">
      <div class="modal-content">
        <h2>Troca de Senha</h2>
        <form @submit.prevent="handlePasswordChange">
          <input type="password" v-model="newPassword" placeholder="Nova senha" required />
          <input type="password" v-model="confirmPassword" placeholder="Confirmar nova senha" required />
          <button type="submit">Confirmar</button>
        </form>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue'
  
  const props = defineProps({ visible: Boolean, email: String })
  const emit = defineEmits(['close', 'passwordChanged'])
  
  const newPassword = ref('')
  const confirmPassword = ref('')
  const errorMessage = ref('')
  
  async function handlePasswordChange() {
    if (newPassword.value !== confirmPassword.value) {
      errorMessage.value = 'As senhas não coincidem'
      return
    }
  
    try {
    const response = await fetch('/api/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: props.email, newPassword: newPassword.value }),
    })

    if (response.ok) {
      emit('passwordChanged')
      closeModal()
    } else {
      errorMessage.value = 'Erro ao atualizar a senha'
    }
  } catch (error) {
    errorMessage.value = 'Erro ao atualizar a senha'
  }
}
  
  function closeModal() {
    emit('close')
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    width: 300px;
  }
  
  .error-message {
    color: red;
    margin-top: 10px;
  }
  </style>
  