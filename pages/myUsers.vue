import { NuxtLink } from '../.nuxt/components';
<template>
    <div>
        <div class="divLogo">
            <img src="../public/images/iconeTexto.png" alt="">
        </div>
        <div class="divList">
            <div class="divListTop">
                <img class="listTop" src="../public/images/PeopleIcon.svg" alt="">
                <h1 class="listTop">Participantes</h1>
            </div>
            
            <div class="divListItens">

                <div v-for="user in users" :key="user.idShort" class="listItens">
                    <img class="listImage" src="../public/images/PeopleExample.svg" alt="">
                    <div class="listUser">
                        <p class="listUserName">{{user.name}}</p>
                        <div v-if="!edit">
                            <img v-if="user.paid" class="listUserName" src="../public/images/HandCoinsGreen.svg" alt="">
                            <img v-else class="listUserName" src="../public/images/HandCoinsRed.svg" alt="">    
                        </div>
                        <div v-else>
                            <img  v-if="user.paid" @click="()=> user.paid=!user.paid" src="../public/images/CheckFat.svg" alt="">
                            <img v-else @click="()=> user.paid=!user.paid" src="../public/images/Selection.svg" alt="">
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
            <button @click="()=> edit=!edit" class="mainButton">
                Salvar
            </button>
        </div>
    </div>
</template>

<script>
    import { ref } from 'vue'
    export	default {
        async setup() {
            let edit = ref(false)
            let users = ref([])
            users.value.push(
                {
                    idShort: 0,
                    name: 'João da Silva',
                    paid: true,
                }
            )
            users.value.push(
                {
                    idShort: 1,
                    name: 'Maria das Palmas',
                    paid: false,
                }
            )

            return {
                edit,
                users
            }
        }
    }
</script>

