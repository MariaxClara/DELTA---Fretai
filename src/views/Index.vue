<template>
  <div class="app-container">
    <div class="logo-container">
      <img src="/images/iconeImage.png" alt="Van Logo" class="van-icon">
    </div>

    <div class="button-group">
      <!-- Botão Motorista -->
      <button @click="toggleModal" class="btn-motorista"> Cadastro </button>
      <!-- Botão Passageiro com o mesmo estilo -->
      <button @click="goToPassageiro" class="btn-motorista">Login</button>
    </div>

    <Modal v-if="showModal" :visible="showModal" @close="toggleModal" />
  </div>
</template>

<script>
export default {
  name: 'Index',
};
</script>

<script setup>
import { useRouter } from 'vue-router';
import { useIndex } from '../composables/index';
import Modal from '../components/Modal.vue';
import '../assets/css/cssInicial.css';

const router = useRouter();
const { showModal, toggleModal } = useIndex();

// Função para redirecionar o passageiro
const goToPassageiro = () => {
  router.push('/Login'); // Certifique-se de que a rota '/passageiro' esteja configurada
};
</script>
