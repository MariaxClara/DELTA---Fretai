<template>
    <div class="troca-senha-container">
      <h1>Trocar Senha</h1>
      <p>Email do usuário: {{ email }}</p>
      <p>Flag: {{ flag }}</p>
  
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
        <button type="submit">Alterar Senha</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const email = ref(route.query.email || '');
  const flag = ref(route.query.flag || 0);
  
  const novaSenha = ref('');
  const confirmaSenha = ref('');
  const erro = ref('');
  
  function submitForm() {
    if (novaSenha.value !== confirmaSenha.value) {
      erro.value = 'As senhas não coincidem. Tente novamente.';
    } else {
      erro.value = '';
      // Aqui você pode implementar a lógica de envio das novas senhas para o backend.
      console.log('Email:', email.value);
      console.log('Flag:', flag.value);
      console.log('Senha alterada com sucesso!');
      alert('Senha alterada com sucesso!');
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
  </style>
  