<template>
  <div class="troca-senha-container">
    <h1>Trocar Senha</h1>
    <p>Email do usuário: {{ email }}</p>

    <form @submit.prevent="submitForm">
      <div>
        <label for="nova-senha">Nova Senha:</label>
        <input
          type="password"
          id="nova-senha"
          v-model="novaSenha"
          placeholder="Digite a nova senha"
          required
        />
      </div>
      <div>
        <label for="confirma-senha">Confirme a Nova Senha:</label>
        <input
          type="password"
          id="confirma-senha"
          v-model="confirmaSenha"
          placeholder="Confirme a nova senha"
          required
        />
      </div>
      <div v-if="erro" class="erro">
        {{ erro }}
      </div>
      <div v-if="successMessage" class="success">
        {{ successMessage }}
      </div>
      <button type="submit">Alterar Senha</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const email = ref(route.query.email || ''); // Obtém o email enviado via query parameters
const novaSenha = ref('');
const confirmaSenha = ref('');
const erro = ref('');
const successMessage = ref('');

async function submitForm() {
  if (novaSenha.value !== confirmaSenha.value) {
    erro.value = 'As senhas não coincidem. Tente novamente.';
    successMessage.value = '';
    return;
  }

  try {
    const response = await fetch('/api/TrocaSenhaMotorista', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, newPassword: novaSenha.value }), // Corrigido aqui
    });

    const data = await response.json();

    if (!response.ok) {
      erro.value = data.error || 'Erro ao atualizar a senha.';
      successMessage.value = '';
      return;
    }

    erro.value = '';
    successMessage.value = 'Senha atualizada com sucesso!';
    setTimeout(() => {
      router.push('/'); // Redireciona para a página inicial ou outra página desejada após sucesso
    }, 2000);
  } catch (err) {
    erro.value = 'Erro de conexão com o servidor.';
    successMessage.value = '';
    console.error(err.message);
  }
}
</script>

<style scoped>
.troca-senha-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}
label {
  display: block;
  margin-bottom: 0.5em;
}
input {
  width: 100%;
  padding: 0.5em;
  margin-bottom: 1em;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  width: 100%;
  padding: 0.5em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
.erro {
  color: red;
  margin-bottom: 1em;
}
.success {
  color: green;
  margin-bottom: 1em;
}
</style>
