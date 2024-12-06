<template>
    <div>

        <div class="divLogo">
            <img src="/images/iconeImage.png" alt="">
        </div>
                
        <div class="divInput">
            <input type="text"
            v-model="userName"
            placeholder="Nome"
            required class="mainInput">
        </div>
    
        
        <div class="divInput">
            <input type="text"
            v-model="userCpf"
            placeholder="CPF"
            required class="mainInput">
        </div>
            
        <div class="divInput">
            <input type="email"
            v-model="userEmail"
            placeholder="E-mail"
            required class="mainInput">
        </div>

        <div class="divInput">
            <input type="text"
            v-model="userPhone"
            placeholder="Telefone"
            required class="mainInput">
        </div>

        <div class="divInput">
            <input type="password"
            v-model="userPassword"
            placeholder="Senha"
            required class="mainInput">
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
            <button @click="cadastroUsuario()" class="mainButton">CADASTRAR</button>
        </div>
  
    </div>
</template>
  
<script>
    export default{
        name: 'cadastroPassageiro',
    }
</script>
  
  
<script setup >
    import { ref } from 'vue'
    import '../assets/css/main.css';

    const {VITE_BASE_URL_BACKEND} = import.meta.env; 

    const errorEnter = ref(false);
    const sucessEnter = ref(false);
    const userName = ref('');
    const userPhone = ref('')
    const userEmail = ref('');
    const userPassword = ref('');
    const userCpf = ref('');
    const messageError = ref('');

    const reEmail = new RegExp(".+@.+");

    async function cadastroUsuario() {
        
        errorEnter.value = false
        sucessEnter.value = false

        if(!(userName.value)) {
            messageError.value = 'Insira seu nome!';
            errorEnter.value = true;
            return;
        }

        if(!(userPassword.value)) {
            messageError.value = 'Insira uma senha!';
            errorEnter.value = true;
            return;
        }

        if(!(userPhone.value)) {
            messageError.value = 'Insira um telefone!';
            errorEnter.value = true;
            return;
        }

        if (userEmail.value) {
            if(!(reEmail.test(userEmail.value))) {
                messageError.value = 'e-mail inválido!';
                errorEnter.value = true;
                return;
            }
        } else {
            messageError.value = 'Insira seu email!';
            errorEnter.value = true;
            return;
        }

        if (userCpf.value) {
            if(userCpf.value.length != 11) {
                messageError.value = 'cpf inválido!';
                errorEnter.value = true;
                return;
            }
        } else {
            messageError.value = 'Insira seu cpf!';
            errorEnter.value = true;
            return;
        }

        userEmail.value = '';

        try {
            let response = await fetch(`${VITE_BASE_URL_BACKEND}/addPassengerUser`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEmail.value,
                    password: userPassword.value,
                    cpf: userPassword.value,
                    phone: userPhone.value,
                    name: userName.value
                })
            })
            if (response.status == 200) {
                sucessEnter = true
            } else {
                errorEnter.value = true
                messageError.value = 'Ops! Parece que nosso servidor está em manutenção ...'
            }
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error)
            errorEnter.value = true
            messageError.value = 'Ops! Parece que nosso servidor está em manutenção ...'
        }
    }
  
</script>