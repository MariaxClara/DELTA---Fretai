<template>
  <div class="tela-inicial">
    <!-- Logo -->
    <div class="logo-container">
      <img src="/images/iconeImage.png" alt="Logo" class="logo" />
    </div>

    <!-- Botões de Navegação -->
    <div class="conteudo">
      <div class="botoes-container">
      <button @click="goToCalendario" class="botao">Calendário</button>
      <button @click="goToPerfilMotorista" class="botao">Perfil Motorista</button>
      <button @click="goToCadastroPassageiro" class="botao">Cadastro Passageiro</button>
      <button @click="goToMyUsers" class="botao">Lista Passageiros</button>
    </div>
  </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import '../assets/css/cssMotoristaHome.css';

const router = useRouter();

const goToCalendario = () => {
  router.push('/calendario');
};

const goToPerfilMotorista = () => {
  router.push('/perfilMotorista');
};

const goToCadastroPassageiro = () => {
  router.push('/RegisterUserDriver');
};

const goToMyUsers = () => {
  router.push('/myUsers');
};
</script>