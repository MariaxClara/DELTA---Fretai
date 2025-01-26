import { NuxtLink } from '../.nuxt/components';
<template>
    <div class="">
        <div class="divLogo">
            <img src="/images/iconeTexto.png" alt="">
        </div>
        <div class="divHeader">
                <img src="/images/PeopleExample.svg" alt="">
                <h1>{{passageiro.name}}</h1>
        </div>
        
        <div style="margin-left: 2rem;">
            <h3 style="margin-bottom: 0.2rem; color: #321c5b">Email: {{passageiro.email}}</h3>
            <h3 style="margin-bottom: 0.2rem; color: #321c5b">CPF: {{passageiro.cpf}}</h3>
            <h3 style="margin-bottom: 0.2rem; color: #321c5b">Telefone: {{passageiro.telefone}}</h3>
            <h3 v-if="passageiro.paid" style="margin-bottom: 0.2rem; color: #67b832"> Pagamento em dia</h3>
            <h3 v-else="passageiro.paid" style="margin-bottom: 0.2rem; color: #ea6161"> Pagamento pendente!</h3>
        </div>

        <div class="mainDiv">
            <div v-if="sucessDelete" class="divSucces">
                <p class="textSucces">passageiro excluido!</p>
            </div>
            
            <div v-if="erroDelete" class="divError">
                <p class="errorSucces">{{ messageError }}</p>
            </div>
        </div>
        <div v-if="!sucessDelete" class="divButton">
            <button @click="deleteUser" class="mainButton">
                Excluir Passageiro
            </button>
        </div>
    </div>
</template>

<script>
    export	default {
        name: 'MyUsersPage',
    }
</script>

<script setup>
    import { ref, onMounted } from 'vue';
    import '../assets/css/main.css';

    const {VITE_BASE_URL_BACKEND} = import.meta.env 

    let id_user = ref(1)
    let passageiro = ref({name: 'Maria Clara',
                         cpf:'434.434.434.43',
                         telefone: '(12) 99191-9191',
                         paid: 1,
                         email: 'exemplo@mail.com'})
    let driverId = ref(1)
    let messageError = ref('')
    const erroDelete = ref(false);
    const sucessDelete = ref(false);

    const takeUser = async () => {
        try {
            console.log("Estou indo pegar as informações do usuário")
            const response = await fetch(`${VITE_BASE_URL_BACKEND}/passengerInfoId/${id_user.value}`, {
                method: 'GET',
            })
            const data = await response.json();
            passageiro = data.body[0]
                
        } catch (error) {
            console.log('Não consegui pegar os dados do passageiro:')
            console.log(error)
        }

    }
    async function deleteUser() {
        try {
            const response = await fetch(`${VITE_BASE_URL_BACKEND}/deleteUser`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    p_id: id_user.value,
                    d_id: driverId.value 
                })
            })
            const data = await response.json();
            sucessDelete.value = true;
        } catch (error) {
            messageError.value = 'Não foi possível deletar o usuário!'
            console.log(error)
            erroDelete.value = true;
        }
    }

    onMounted(() => {
        takeUser(id_user)
    })

</script>

