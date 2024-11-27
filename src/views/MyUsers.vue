import { NuxtLink } from '../.nuxt/components';
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

                <div v-for="user in users" :key="user.idShort" class="listItens">
                    <img class="listImage" src="/images/PeopleExample.svg" alt="">
                    <div class="listUser">
                        <p class="listUserName">{{user.name}}</p>
                        <div v-if="!edit">
                            <img v-if="user.paid" class="listUserName" src="/images/HandCoinsGreen.svg" alt="">
                            <img v-else class="listUserName" src="/images/HandCoinsRed.svg" alt="">    
                        </div>
                        <div v-else>
                            <img  v-if="user.paid" @click="()=> {user.paid=!user.paid; user.update = 1}" src="/images/CheckFat.svg" alt="">
                            <img v-else @click="()=> {user.paid=!user.paid; user.update = 1}" src="/images/Selection.svg" alt="">
                        </div>
                    </div>
                </div>

            </div>
        
        </div>
        
        <div v-if="!edit" class="divButton">
            <button  @click="()=> edit=!edit" class="mainButton">
                <router-link :to="{name: 'RegisterUserDriver'}" class="mainLink">Adicionar Participante</router-link>
            </button>
            <button @click="()=> edit=!edit" class="mainButton">
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

<script>
    export	default {
        name: 'MyUsersPage',
    }
</script>

<script setup>
    import { ref, onMounted } from 'vue';
    import '../assets/css/main.css';

    const {VITE_BASE_URL_BACKEND} = import.meta.env 

    let edit = ref(false)
    let users = ref([])
    let driverId = ref(1)
    let messageError = ref('')

    const takeUsers = async () => {
        try {
            const response = await fetch(`${VITE_BASE_URL_BACKEND}/driverUsers/${driverId.value}`, {
                method: 'GET',
            })
            const data = await response.json();
            let passageiros = []
            for (let i in data.body) {
                let passageiro = data.body[i]
                passageiros.push({
                    idShort: i,
                    name: passageiro.passageiro_nome,
                    paid: passageiro.passageiro_pagamento,
                    update: 0,
                })
            }
            users.value = passageiros
        } catch (error) {
            console.log('Não consegui pegar os passageiros:')
            console.log(error)
        }

    }
    async function updateUsers() {
        edit.value=!edit.value
        try {
            for (let user in users.value) {
                try {
                    const response = await fetch(`http://localhost:3000/updateUserPay`, {
                    method: 'POST',
                    body: JSON.stringify({
                        email: user.email,
                        paid: user.paid
                    })
                    })
                    console.log(response)
                } catch (error) {
                    messageError.value = 'Parece que nosso servidor está em manutenção, não foi possível salvar as modificações!'
                }
            }
        } catch (error) {
            messageError.value = 'Parece que nosso servidor está em manutenção, não foi possível salvar as modificações!'
            console.log(error)
            console.log(messageError)
        }
    }

    onMounted(() => {
        takeUsers()
    })

</script>

