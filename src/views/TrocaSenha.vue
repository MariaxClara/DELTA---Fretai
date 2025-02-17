<template>
  <div class="tela-inicial">
    <!-- Logo -->
    <div class="logo-container">
      <img src="/images/iconeImage.png" alt="Logo" class="logo" />
    </div>


    <h1 class="header">Trocar Senha</h1>
    <p class="descricao">Email do usuário: <span class="black-text">{{ userEmail }}</span></p>
    <div class="form-container">
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
        <button type="submit" class="botao" @click = "submitForm" >
          Alterar Senha
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Inicializa o Vue Router
const router = useRouter();

// Função para obter cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(';').shift());
  }
  return null;
}

// Obtém o email do usuário salvo no cookie
const userEmail = getCookie('userEmail');
const novaSenha = ref('');
const confirmaSenha = ref('');
const erro = ref('');
const successMessage = ref('');

async function submitForm() {
  console.log(" AsdasdasdasD");
  if (novaSenha.value !== confirmaSenha.value) {
    erro.value = 'As senhas não coincidem. Tente novamente.'; 
    successMessage.value = '';
    return;
  }

  try {
    const { VITE_BASE_URL_BACKEND } = import.meta.env;
    const response = await fetch(`${VITE_BASE_URL_BACKEND}/changePassword`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, newPassword: novaSenha.value, confirmPassword:confirmaSenha.value }),
    });

    const data = await response.json();

    if (!response.ok) {
      erro.value = data.error || 'Erro ao atualizar a senha.';
      successMessage.value = '';
      return;
    }

    erro.value = '';
    successMessage.value = 'Senha atualizada com sucesso!';
    console.log(userEmail);
    
    setTimeout(() => {
      router.push("/Login");
    }, 2000);

  } catch (err) {
    erro.value = 'Erro de conexão com o servidor.';
    successMessage.value = '';
    console.error(err.message);
  }
}
</script>

<style scoped>
/* Estrutura Base da Página */
.tela-inicial {
  position: relative;
  background: #BAE6FD;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 100px;
}

/* Logo */
.logo-container {
  margin-bottom: 20px;
}

.logo {
  width: 300px; /* Tamanho maior para o logo */
  margin-bottom: 10px;
}
.black-text {
  color: #000;
  font-weight: bold;
}

/* Título */
.header {
  font-family: 'Grandstander', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #000;
  margin-bottom: 10px;
}

/* Descrição */
.descricao {
  font-size: 18px;
  color: #000;
  margin-bottom: 20px;
}

/* Formulário */
.form-container {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  width: 350px;
  display: flex;
  color: #000;

  flex-direction: column;
}

label {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: 15px;
}

/* Botão */
.botao {
  width: 100%;
  height: 50px;
  background: #3498DB;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background 0.3s ease;
}

.botao img {
  width: 24px;
  height: 24px;
}

.botao:hover {
  background: #2874A6;
}

/* Mensagens de erro e sucesso */
.erro {
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
}

.success {
  color: green;
  font-size: 14px;
  margin-bottom: 10px;
}
</style>
