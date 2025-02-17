// login.vue
<template>
  <div class="login-container">
    <div class="logo-container">
      <img src="/images/iconeImage.png" alt="Van Logo" class="van-icon">
    </div>

    <form class="login-form" @submit.prevent="handleLoginSubmit">
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
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

    <PasswordResetModal
      v-if="showPasswordReset"
      :visible="showPasswordReset"
      :email="formData.email"
      @close="showPasswordReset = false"
      @passwordChanged="onPasswordChanged"
    />

    <!-- <p v-if="userType" class="user-type-message">
      Tipo de usuário: {{ userType }}
    </p> -->
  </div>
</template>



<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import useLogin from '../composables/UseLogin';
import PasswordResetModal from '../components/ResetarSenha.vue';
import '../assets/css/login.css';

const router = useRouter();

const {
  formData,
  showPasswordReset,
  loginAndDetermineUserType,
  userType,
  errorMessage,
} = useLogin();

// Função para definir um cookie
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Função para obter um cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const handleLoginSubmit = async () => {
  const userTypeResult = await loginAndDetermineUserType();

  if (userTypeResult) {
    // Salva o userType no cookie com validade de 7 dias
    setCookie('userType', userTypeResult, 7);

    switch (userTypeResult) {
      case 'motorista':
        console.log('Logged in as driver');
        await router.push({ name: 'MotoristaHome' });
        break;
      case 'passageiro':
        console.log('Logged in as passenger');
        await router.push({ name: 'Home' });
        break;
      case 'desconhecido':
        console.log('Tipo de usuário desconhecido.');
        errorMessage.value = 'Tipo de usuário inválido.';
        break;
      default:
        console.log('Unknown user type');
        errorMessage.value = 'Falha no login. Verifique suas credenciais.';
    }
  } else {
    errorMessage.value = 'Falha no login. Verifique suas credenciais.';
  }
};

// Função para executar ao mudar a senha
const onPasswordChanged = () => {
  showPasswordReset.value = false;
};
</script>


<style scoped>
.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
  text-align: center;
}

.user-type-message {
  margin-top: 1rem;
  text-align: center;
  color: #28a745;
}

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