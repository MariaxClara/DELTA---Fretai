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
                    :style="{ cursor: edit ? 'pointer' : 'default' }"
                >
                    <img class="listImage" src="/images/PeopleExample.svg" alt="">
                    <div class="listUser">
                        <p class="listUserName">{{ user.name }}</p>
                        <div v-if="!edit">
                            <img v-if="user.paid" class="listUserName" src="/images/HandCoinsGreen.svg" alt="Pago">
                            <img v-else class="listUserName" src="/images/HandCoinsRed.svg" alt="Não pago">    
                        </div>
                        <div v-else>
                            <img 
                                v-if="user.paid" 
                                @click.stop="togglePayment(user)" 
                                class="listUserName" 
                                src="/images/CheckFat.svg" 
                                alt="Pago" 
                                style="cursor: pointer;"
                            />
                            <img 
                                v-else 
                                @click.stop="togglePayment(user)" 
                                class="listUserName" 
                                src="/images/Selection.svg" 
                                alt="Não pago" 
                                style="cursor: pointer;"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
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
            <button @click="edit = !edit" class="mainButton">
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
        numPassageiros.value = passageiros.length; 
    } catch (error) {
        console.log('Não consegui pegar os passageiros:', error);
    }
};

const closeErrorPopup = () => {
    showError.value = false;
};

const togglePayment = async (user) => {
    try {
        const response = await fetch(`${VITE_BASE_URL_BACKEND}/toggle-payment`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ passageiro_id: user.idShort }),
        });

        if (!response.ok) {
            throw new Error("Erro ao atualizar pagamento");
        }

        const data = await response.json();
        user.paid = data.passageiro_pagamento;
        console.log("Pagamento atualizado:", data);
    } catch (error) {
        console.error("Erro ao atualizar pagamento:", error);
    }
};
onMounted(() => {
    takeUsers();
    getMaxPassageiros();
});
</script>
