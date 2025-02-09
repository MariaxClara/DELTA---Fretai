<template>
    <div class="">
        <div v-if="exclude" class="modal">
            <div class="modal-content">
                <p> Tem certeza que deseja excluir o passageiro?</p>
                <div class="modal-buttons">
                    <button @click="deleteUser()">Excluir!</button>
                    <button @click="() => { exclude = false }">Cancelar</button>
                </div>
            </div>
        </div>

        <div class="divLogo">
            <img src="/images/iconeTexto.png" alt="">
        </div>
        <div class="divHeader">
            <img src="/images/PeopleExample.svg" alt="">
            <h1>{{ passageiro.name }}</h1>
        </div>
        
        <div style="margin-left: 2rem;">
            <h3 style="margin-bottom: 0.2rem; color: #321c5b">Email: {{ passageiro.email }}</h3>
            <h3 style="margin-bottom: 0.2rem; color: #321c5b">Telefone: {{ passageiro.telefone }}</h3>
            <h3 v-if="passageiro.paid" style="margin-bottom: 0.2rem; color: #67b832">Pagamento em dia</h3>
            <h3 v-else style="margin-bottom: 0.2rem; color: #ea6161">Pagamento pendente!</h3>
        </div>

        <div class="divButton">
            <button @click="goToChat()" class="mainButton">Conversar com Passageiro</button>
        </div>

        <div class="mainDiv">
            <div v-if="sucessDelete" class="divSucces">
                <p class="textSucces">Passageiro excluído!</p>
            </div>
            
            <div v-if="erroDelete" class="divError">
                <p class="errorSucces">{{ messageError }}</p>
            </div>
        </div>

        <div v-if="!sucessDelete" class="divButton">
            <button @click="deleteOk" class="mainButton">Excluir Passageiro</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'; 
import '../assets/css/main.css';

const route = useRoute();
const router = useRouter();

const id_user = ref(route.params.id);
const passageiro = ref({});
const messageError = ref('');
const exclude = ref(false);
const erroDelete = ref(false);
const sucessDelete = ref(false);

const { VITE_BASE_URL_BACKEND } = import.meta.env;

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(';').shift());
    }
    return null;
}

const driverId = ref(getCookie('userID'));

const takeUser = async () => {
    if (!id_user.value) return;
    try {
        console.log("Pegando informações do passageiro com ID:", id_user.value);
        const response = await fetch(`${VITE_BASE_URL_BACKEND}/passengerInfoId/${id_user.value}`, {
            method: 'GET',
        });
        const data = await response.json();
        passageiro.value = data.body[0]; 
    } catch (error) {
        console.log('Erro ao pegar os dados do passageiro:', error);
    }
};

watch(() => route.params.id, (newId) => {
    if (newId) {
        id_user.value = newId;
        takeUser(); // Chama takeUser() corretamente
    }
}, { immediate: true });

function deleteOk() {
    exclude.value = true;
}

async function goToChat() {
    if (!driverId.value || !id_user.value) {
        console.log("Erro: IDs não definidos!");
        return;
    }
    router.push(`/chat/${driverId.value}/${id_user.value}`);
}

async function deleteUser() {
    exclude.value = false;
    try {
        const response = await fetch(`${VITE_BASE_URL_BACKEND}/deleteUser`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                p_id: id_user.value
            })
        });
        await response.json();
        sucessDelete.value = true;
    } catch (error) {
        messageError.value = 'Não foi possível deletar o usuário!';
        console.log(error);
        erroDelete.value = true;
    }
}
</script>
