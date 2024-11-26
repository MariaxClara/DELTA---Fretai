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
            <button class="mainButton">
                <NuxtLink class="mainLink" to="/registerUserDriver">
                    Adicionar Participante
                </NuxtLink>
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
    import { ref, onMounted } from 'vue'

    let edit = ref(false)
    let users = ref([])
    let driverId = ref(1)
    let messageError = ref('')

    const takeUsers = async () => {
                console.log('Estou indo pegar os passageiros')
                try {
                    const response = await fetch('/api/driverUsers', {
                        method: 'GET',
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        body: {id: driverId.value}
                    })
                    const data = await response.json();
                    console.log(data)

                } catch (error) {
                    //messageError.value = 'Parece que nosso servidor está em manutenção!'
                    console.log('Não consegui pegar os passageiros:')
                    console.log(messageError)
                }

    }
    async function updateUsers() {
                edit.value=!edit.value
                try {
                    for (user in users.value) {
                        try {
                            const response = await fetch('/api/updateUserPay', {
                                method: 'POST',
                                headers: {
                                'Content-Type': 'application/json'
                                },
                                body: {
                                    email: user.email,
                                    paid: user.paid
                                },
                                mode: 'no-cors'
                            })
                            console.log(response)
                        }
                        catch (error) {
                            messageError.value = 'Parece que nosso servidor está em manutenção, não foi possível salvar as modificações!'
                            console.log(messageError)
                        }
                    }
                } catch (error) {
                    messageError.value = 'Parece que nosso servidor está em manutenção, não foi possível salvar as modificações!'
                    console.log(messageError)
                }
            }
            users.value.push(
                {
                    idShort: 0,
                    name: 'João da Silva',
                    paid: 1,
                }
            )
            users.value.push(
                {
                    idShort: 1,
                    name: 'Maria das Palmas',
                    paid: 0,
                }
    )

    onMounted(() => {
                takeUsers()
    })

</script>

