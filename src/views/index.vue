<template>
  <div class="app-container">
    <div class="logo-container">
      <img src="~/public/images/iconeImage.png" alt="Van Logo" class="van-icon">
    </div>

    <div class="button-group">
      <button @click="toggleModal" class="btn-motorista">Sou Motorista</button>
      <button @click="toggleModal" class="btn-passageiro">Sou Passageiro</button>
    </div>

    <Modal v-if="showModal" :visible="showModal" @close="toggleModal" />
  </div>
</template>

<script>
  export default{
    name: 'Index',
  }
</script>

<script setup>
import { useIndex } from '../composables/index'
import Modal from '../components/Modal.vue'
import '../assets/css/cssInicial.css'

const { showModal, toggleModal } = useIndex()
</script>