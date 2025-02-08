<template>
    <div>
        <div class="divLogo">
            <img src="/images/iconeTexto.png" alt="">
        </div>
        <div class="divList">
            <div class="divListTop">
                <img class="listTop" src="/images/PeopleIcon.svg" alt="">
                <h1 class="listTop">Participantes</h1>
            </div>
            
            <div class="divListItens">
                <div 
                    v-for="user in users" 
                    :key="user.idShort" 
                    class="listItens"
                    @click="goToChat(user.idShort)" 
                    style="cursor: pointer;" 
                >
                    <img class="listImage" src="/images/PeopleExample.svg" alt="">
                    <div class="listUser">
                        <p class="listUserName">{{ user.name }}</p>
                        <div v-if="!edit">
                            <img v-if="user.paid" class="listUserName" src="/images/HandCoinsGreen.svg" alt="">
                            <img v-else class="listUserName" src="/images/HandCoinsRed.svg" alt="">    
                        </div>
                        <div v-else>
                            <img v-if="user.paid" @click.stop="togglePayment(user)" src="/images/CheckFat.svg" alt="">
                            <img v-else @click.stop="togglePayment(user)" src="/images/Selection.svg" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-if="!edit" class="divButton">
            <button @click="edit = !edit" class="mainButton">
                <router-link :to="{name: 'RegisterUserDriver'}" class="mainLink">Adicionar Participante</router-link>
            </button>
            <button @click="edit = !edit" class="mainButton">
                Editar Participantes
            </button>
        </div>

        <div v-else class="divButton">
            <button @click="updateUsers" class="mainButton">
                Salvar
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import '../assets/css/main.css';

const router = useRouter();

const { VITE_BASE_URL_BACKEND } = import.meta.env;

let edit = ref(false);
let users = ref([]);
let messageError = ref('');

// Função para obter o cookie do userID
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(';').shift());
    }
    return null;
}

const driverId = ref(getCookie('userID')); // Obtém o ID do motorista salvo no cookie
console.log('id motorista:', driverId.value);

// Função para buscar usuários
const takeUsers = async () => {
    try {
        console.log("Estou indo pegar meus users");
        const response = await fetch(`${VITE_BASE_URL_BACKEND}/driverUsers/${driverId.value}`, {
            method: 'GET',
        });
        const data = await response.json();
        let passageiros = [];
        for (let i in data.body) {
            let passageiro = data.body[i];
            passageiros.push({
                idShort: passageiro.passageiro_id,
                name: passageiro.passageiro_nome,
                paid: passageiro.passageiro_pagamento,
                email: passageiro.passageiro_email,
                update: 0,
            });
        }
        users.value = passageiros;
    } catch (error) {
        console.log('Não consegui pegar os passageiros:', error);
    }
};

// Função para atualizar usuários
const updateUsers = async () => {
    edit.value = !edit.value;
    try {
        for (let user of users.value) {
            try {
                await fetch(`${VITE_BASE_URL_BACKEND}/updateUserPay`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: user.email,
                        paid: Number(user.paid)
                    })
                });
            } catch (error) {
                messageError.value = 'Erro ao salvar as modificações. O servidor pode estar fora do ar.';
            }
        }
    } catch (error) {
        messageError.value = 'Erro ao salvar as modificações.';
        console.log(error);
    }
};

// Função para ir para a página de chat com o passageiro escolhido
const goToChat = (passageiroId) => {
    router.push(`/chat/${driverId.value}/${passageiroId}`);
};

// Função para alternar o pagamento sem clicar no usuário
const togglePayment = (user) => {
    user.paid = !user.paid;
    user.update = 1;
};

onMounted(() => {
    takeUsers();
});
</script>
