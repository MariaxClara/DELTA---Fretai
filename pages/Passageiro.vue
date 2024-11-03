<!-- pages/Passageiro.vue -->
<template>
    <div class="login-container">
        <form class="login-form" @submit.prevent="fetchPassengerInfo"> 
            <h1 class="title">Informações do Passageiro</h1>
  
            <input v-model="email" 
                placeholder="Digite o e-mail do passageiro"/>
  
            <button type="submit" class="cadastrar-btn">Buscar</button>
  
            <div v-if="passengerInfo" class="dados">
                <h2>Informações do Passageiro:</h2>
                <p><strong>Nome:</strong> {{ passengerInfo.passageiro_nome }}</p>
                <p><strong>Email:</strong> {{ passengerInfo.passageiro_email }}</p>
                <p><strong>Telefone:</strong> {{ passengerInfo.passageiro_telefone }}</p>
                
                <h3>Motoristas Relacionados:</h3>
                <ul>
                    <li v-for="motorista in passengerInfo.motoristas" :key="motorista.motorista_telefone">
                        <p><strong>Nome:</strong> {{ motorista.motorista_nome }}</p>
                        <p><strong>Telefone:</strong> {{ motorista.motorista_telefone }}</p>
                    </li>
                </ul>
            </div>
        
            <p v-else-if="error" class="error">{{ error }}</p>
        </form>
    </div>
    <div class="bottom-section">
        <!-- Se houver algum conteúdo adicional, coloque aqui -->
    </div>
</template>
  
<script setup>
import { ref } from 'vue';
import '~/assets/css/cssPerfilMotorista.css'; // Importando o CSS do motorista

const email = ref('');
const passengerInfo = ref(null);
const error = ref(null);
  
async function fetchPassengerInfo() {
    try {
        const response = await fetch(`/api/passengerInfo?email=${email.value}`);
        const data = await response.json();

        if (data.statusCode !== 200) {
            error.value = data.body.error || 'Erro desconhecido';
            return;
        }

        // Transformar os dados recebidos
        if (data.body.length > 0) {
            // Armazena informações do passageiro
            const firstPassenger = data.body[0]; // Obtemos as informações do passageiro da primeira entrada
            passengerInfo.value = {
                passageiro_nome: firstPassenger.passageiro_nome,
                passageiro_email: firstPassenger.passageiro_email,
                passageiro_telefone: firstPassenger.passageiro_telefone,
                motoristas: data.body.map(item => ({
                    motorista_nome: item.motorista_nome,
                    motorista_telefone: item.motorista_telefone,
                })),
            };
        } else {
            passengerInfo.value = null; // Nenhum passageiro encontrado
        }
        error.value = null;
    } catch (err) {
        error.value = err.message;
    }
}
</script>
  
<style scoped>
/* Estilos adicionais ou específicos para a página de Passageiro podem ser adicionados aqui se necessário */
</style>
