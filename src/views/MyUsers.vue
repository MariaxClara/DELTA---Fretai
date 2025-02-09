<template>
    <div>
        <div class="divLogo">
            <img src="/images/iconeTexto.png" alt="">
        </div>
        <div class="divList">
            <div class="divListTop">
                <img class="listTop" src="/images/PeopleIcon.svg" alt="">
                <h1 class="listTop">Participantes {{ numPassageiros }} / {{ maxPassageiros }}</h1>
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
        
        <!-- Pop-up de erro -->
        <div v-if="showError" class="errorPopup">
            <div class="errorMessage">
                <p>{{ errorMessage }}</p>
                <button @click="closeErrorPopup">Fechar</button>
            </div>
        </div>
        
        <div v-if="!edit" class="divButton">
            <button @click="checkMaxPassageiros" class="mainButton">
                Adicionar Participante
            </button>
            <button @click="edit = !edit" class="mainButton">
                Editar Participantes
            </button>
            <button @click="goToCalendar" class="mainButton">
                Calendário
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
const numPassageiros = ref(0);
const maxPassageiros = ref(0);

const showError = ref(false);  // Controle do pop-up
const errorMessage = ref('');

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(';').shift());
    }
    return null;
}

const driverId = ref(getCookie('userID')); 

const goToChat = (passageiroId) => {
    if (!driverId.value || !passageiroId) {
        console.error("Erro: driverId ou passageiroId não definidos.");
        return;
    }
    console.log(`Redirecionando para: /chat/${driverId.value}/${passageiroId}`);
    router.push(`/chat/${driverId.value}/${passageiroId}`);
};

const goToCalendar = () => {
    console.log("Redirecionando para o calendário...");
    router.push('/calendario');
};

const getMaxPassageiros = async () => {
    try {
        const response = await fetch(`${VITE_BASE_URL_BACKEND}/maxPassageiros/${driverId.value}`, {
            method: 'GET',
        });
        const data = await response.json();
        
        if (data && data[0] && data[0].max_passageiros !== undefined) {
            maxPassageiros.value = data[0].max_passageiros;
        } else {
            console.log('Valor max_passageiros não encontrado na resposta');
        }
    } catch (error) {
        console.log('Erro ao buscar a quantidade máxima de passageiros:', error);
    }
};

const takeUsers = async () => {
    try {
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
        numPassageiros.value = passageiros.length; // Atualiza o número de passageiros
    } catch (error) {
        console.log('Não consegui pegar os passageiros:', error);
    }
};

const checkMaxPassageiros = () => {
    if (numPassageiros.value >= maxPassageiros.value) {
        showError.value = true;
        errorMessage.value = "Não é possível cadastrar, pois atingiu o limite máximo de passageiros.";
    } else {
        router.push({ name: 'RegisterUserDriver' });
    }
};

const closeErrorPopup = () => {
    showError.value = false;
};


const togglePayment = (user) => {
    user.paid = !user.paid; // Alterna o status de pagamento
};

onMounted(() => {
    takeUsers();
    getMaxPassageiros();
});
</script>
