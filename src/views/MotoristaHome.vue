<template>
  <div class="tela-inicial">
    <!-- Logo -->
    <div class="logo-container">
      <img src="/images/iconeImage.png" alt="Logo" class="logo" />
    </div>

    <!-- Botões de Navegação -->
    <div class="participantes">
      <button @click="goToCalendario" class="botao">Calendário</button>
      <button @click="goToPerfilMotorista" class="botao">Perfil Motorista</button>
      <button @click="goToCadastroPassageiro" class="botao">Cadastro Passageiro</button>
      <button @click="goToMyUsers" class="botao">Lista Passageiros</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToCalendario = () => {
  router.push('/calendario');
};

const goToPerfilMotorista = () => {
  router.push('/perfilMotorista');
};

const goToCadastroPassageiro = () => {
  router.push('/cadastroPassageiro');
};

const goToMyUsers = () => {
  router.push('/myUsers');
};
</script>

<style scoped>
/* Tela Inicial */
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
  width: 300px; /* Logo aumentado */
  margin-bottom: 10px;
}

/* Botão Genérico */
.botao {
  width: 359px;
  height: 75px;
  background: #3498DB;
  border: 2px solid #FFFCFC;
  border-radius: 5px;
  color: #FFFCFC;
  font-family: 'Grandstander', sans-serif;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  letter-spacing: -0.3px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.botao:hover {
  background: #2874A6;
}
</style>
