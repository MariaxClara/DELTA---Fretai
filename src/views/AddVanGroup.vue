<template>
    <div>

        <div class="divLogo">
            <img src="/images/iconeImage.png" alt="">
        </div>

        <div class="divInput">
            <input v-model="userEmail" type="text" class="mainInput" placeholder="Email" >
        </div>

        <div class="divInput">
            <input v-model="userPassword" type="password" class="mainInput" placeholder="Senha" >
        </div>
        
        <div class="divInput">
            <input v-model="code" type="password" class="mainInput" placeholder="Código de convite" >
        </div>

        <div class="mainDiv">
            <div v-if="sucessEnter" class="divSucces">
                <p class="textSucces"> Cadastro realizado com suscesso!</p>
            </div>
            
            <div v-if="errorEnter" class="divError">
                <p class="errorSucces">{{ messageError }}</p>
            </div>

        </div>
        
        <div class="divButton">
            <button class="mainButton" @click="enterGroup()"> Entrar no grupo </button>
            <button class="mainButton">
                <router-link :to="{name: 'CadastroPassageiro'}" class="mainLink"> Não tem login? Cadastre-se</router-link>
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
    import { ref } from 'vue'
    import '../assets/css/main.css'

    const {VITE_BASE_URL_BACKEND} = import.meta.env 

    const errorEnter = ref(false);
    const sucessEnter = ref(false);
    const userEmail = ref('');
    const userPassword = ref('');
    const code = ref('');
    const messageError = ref('');


    async function enterGroup() {
        errorEnter.value = false
        sucessEnter.value = false
        try {
            let response = await fetch(`${VITE_BASE_URL_BACKEND}/addPassengerUser`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEmail.value,
                    password: userPassword.value,
                    code: code.value
                })
            })
            if ( response.status == 401){
                errorEnter.value = true
                messageError.value = "Login ou senha incorretos" 
            } else if (response.status == 400) {
                errorEnter.value = true
                messageError.value = "Código de motorista inválido"
            } else if (response.status == 200) {
                sucessEnter = true
            } else {
                errorEnter.value = true
                messageError.value = 'Ops! Parece que nosso servidor está em manutenção ...'
            }

        } catch (error) {
            errorEnter.value = true
            messageError.value = 'Ops! Parece que nosso servidor está em manutenção ...'
            console.log("Erro:",error)
        }
    }

</script>