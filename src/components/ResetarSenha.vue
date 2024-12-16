<template>
  <div class="modal-overlay" v-if="visible" @click.self="closeModal">
    <div class="modal-content">
      <h2>Troca de Senha</h2>
      <form @submit.prevent="handlePasswordSubmit">
        <input type="password" v-model="newPassword" placeholder="Nova senha" required />
        <input type="password" v-model="confirmPassword" placeholder="Confirmar nova senha" required />
        <button type="submit">Confirmar</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  visible: Boolean,
  email: String,
});
const emit = defineEmits(['close', 'passwordChanged']);

const newPassword = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');

async function handlePasswordSubmit() {
  if (newPassword.value !== confirmPassword.value) {
    console.log('As senhas são diferentes - Front');
    errorMessage.value = "As senhas não coincidem.";
    return;
  }
  
  try {
    console.log("Enviando requisição para atualizar a senha - Front");
    const response = await fetch('http://localhost:3000/changePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: props.email,
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value, // Inclua confirmPassword aqui
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar a senha');
    }

    alert('Senha atualizada com sucesso');
    emit('passwordChanged');
    closeModal();
  } catch (error) {
    console.error("Erro na atualização de senha - Front", error);
    if (error instanceof Error) {
      errorMessage.value = error.message || 'Erro ao atualizar a senha';
    } else {
      errorMessage.value = 'Erro ao atualizar a senha';
    }
  }
}

function closeModal() {
  emit('close');
}
</script>