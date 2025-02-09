<template>
  <div class="modal-overlay" v-if="visible" @click.self="closeModal">
    <div class="modal-content">
      <h3>Escolha o tipo de conta</h3>
      <button @click="goToCadastroMotorista" class="modal-button">Motorista</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import '../assets/css/cssInicial.css'

const props = defineProps({
visible: Boolean
})
const emit = defineEmits(['close'])
const router = useRouter()

function closeModal() {
emit('close')
}

// ✅ Redireciona para CadastroMotorista
function goToCadastroMotorista() {
router.push('/CadastroMotorista')
}

// ✅ Redireciona para CadastroPassageiro
function goToCadastroPassageiro() {
router.push('/CadastroPassageiro')
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
border-radius: 10px;
text-align: center;
width: 250px;
}

.modal-button {
background-color: white;
color: #007bff;
padding: 10px 10px;
display: block;
margin: 10px auto;
width: 80%;
border: 1px solid #007bff;
border-radius: 5px;
cursor: pointer;
}

.modal-button:hover {
transform: translateY(-2px); 
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
background-color: #007bff;
color: white;
}
</style>
