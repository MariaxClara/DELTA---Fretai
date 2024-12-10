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
    import '../assets/css/main.css'

    const {VITE_BASE_URL_BACKEND} = import.meta.env 

    const driverId = ref(1);
    const driverName = ref('João') 
    const driverCode = ref('111-111')
    const errorInvite = ref(false);
    const sucessInvite = ref(false);
    const errorMessage = ref('');
    const userEmails = ref([])
    const userEmail = ref('');
    const messageError = ref('');

    const reEmail = new RegExp(".+@.+");

    async function sendWelcomeEmail (userTo, driverName, inviteCode) {
        let textValue = "Seja bem vindo ao fretai, você foi convidado para participar da van de "+driverName+". Siga o link http://localhost, o código da van é: "+inviteCode 
        try {           
            const response = await fetch(`${VITE_BASE_URL_BACKEND}/sendEmail`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: userTo,
                    from: "fretaiunifesp@gmail.com",
                    subject: "Bem vindo ao Fretai!",
                    text: textValue
                })
            })                    
        } catch (error) {
            messageError.value = 'Parece que nosso servidor está em manutenção, não foi possível convidar o usuário!'
            console.log(messageError)
        }
    }

    async function addUser(email) {
        try {           
            const response = await fetch(`${VITE_BASE_URL_BACKEND}/addUserEmailInvite`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                            email: email,
                            id: Number(driverId.value)
                })
            })                    
        } catch (error) {
            messageError.value = 'Parece que nosso servidor está em manutenção, não foi possível convidar o usuário!'
            console.log(messageError)
        }
    }

    const takeUsers = async () => {
        try {
            const response = await fetch(`${VITE_BASE_URL_BACKEND}/driverInvites/${driverId.value}`, {
                method: 'GET'
            })
            const data = await response.json();
            for (let i in data.body) {
                userEmails.value.push(data.body[i])
            }

        } catch (error) {
            messageError.value = 'Parece que nosso servidor está em manutenção!'
            console.log(error)
        }

    }

    function inviteUser() {

        errorInvite.value = false;
        sucessInvite.value = false;

        if (userEmail.value) {
            if(reEmail.test(userEmail.value)) {
                if(Array.from(userEmails.value).includes(userEmail.value)) {
                    errorMessage.value = 'e-mail já convidado!';
                    errorInvite.value = true;
                } else {
                    sucessInvite.value = true;
                    sendWelcomeEmail(userEmail.value, driverName.value, driverCode.value)
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