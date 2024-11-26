<template>
    <div>

        <div class="divLogo">
            <img src="/images/iconeImage.png" alt="">
        </div>


        <div class="divInput">
            <input v-model="userEmail" type="text" class="mainInput" placeholder="Email do participante" >
        </div>

        <div class="mainDiv">
            <div v-if="sucessInvite" class="divSucces">
                <p class="textSucces">convite enviado com sucesso!</p>
            </div>
            
            <div v-if="errorInvite" class="divError">
                <p class="errorSucces">{{ errorMessage }}</p>
            </div>

        </div>
        
        <div class="divButton">
            <button class="mainButton" @click="inviteUser()"> Convidar Cliente </button>
            <button class="mainButton">
                <router-link :to="{name: 'MyUsers'}" class="mainLink"> Voltar</router-link>
            </button>
        </div>
   

    </div>
</template>

<script>
    export default {
        name: 'RegisterUserDrive',
       
    }
</script>

<script setup>
    import { ref, onMounted } from 'vue'
    import axios from 'axios'
    import '../assets/css/main.css'

    const driverId = ref(1);
    const errorInvite = ref(false);
    const sucessInvite = ref(false);
    const errorMessage = ref('');
    const userEmails = ref([])
    const userEmail = ref('');
    const messageError = ref('');

    const reEmail = new RegExp(".+@.+");

    userEmails.value = ["cla@uni.com", "mar@uni.com"]

    async function sendWelcomeEmail (userTo, driverName, linkInvite) {
        console.log("Enviando email...")
    }

    async function addUser(email) {
        try {
            const response = await fetch('/api/addDriverInvite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    email: email,
                    id: driverId.value
                },
                mode: 'no-cors'
            })
            console.log("Banco atualizado")
            console.log(response)
                    
        } catch (error) {
            messageError.value = 'Parece que nosso servidor está em manutenção, não foi possível convidar o usuário!'
            console.log(messageError)
        }
    }

    const takeUsers = async () => {
        try {
            const response = await fetch('/api/driverInvites', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                },
                body: {id: driverId.value}
            })
            const data = await response.json();
            console.log(data)

        } catch (error) {
            messageError.value = 'Parece que nosso servidor está em manutenção!'
            console.log(messageError)
        }

    }

    function inviteUser() {

        errorInvite.value = false;
        sucessInvite.value = false;

        if (userEmail.value) {
            if(reEmail.test(userEmail.value)) {
                if(Array.from(userEmails.value).includes(userEmail.value)) {
                    errorMessage.value = 'e-mail já cadastrado!';
                    errorInvite.value = true;
                } else {
                    sucessInvite.value = true;
                    sendWelcomeEmail(userEmail.value, driverId.value, 'https://www.google.com/')
                    addUser(userEmail.value);
                }
            } else {
                errorMessage.value = 'e-mail inválido!';
                errorInvite.value = true;
            }
        }   else {
            errorMessage.value = 'e-mail inválido!';
            errorInvite.value = true;
        }

        userEmail.value = '';

    }

            
    onMounted(() => {
        takeUsers()
    })
</script>