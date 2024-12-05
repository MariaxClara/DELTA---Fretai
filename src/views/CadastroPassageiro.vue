<template>
    <div class="login-container">

        <div class="logo-container">
            <img src="/images/iconeImage.png" alt="Van Logo" class="van-icon">
        </div>
    
        <form class="login-form" @submit.prevent="cadastroUsuario">
            <input type="text"
            v-model="userName"
            placeholder="Nome"
            required>
    
            <input type="text"
            v-model="userCpf"
            placeholder="CPF"
            required>
    
            <input type="email"
            v-model="userEmail"
            placeholder="E-mail"
            required>

            <input type="text"
            v-model="userPhone"
            placeholder="Telefone"
            required>

            <input type="password"
            v-model="userPassword"
            placeholder="Senha"
            required>
    
            <button type="submit" class="cadastrar-btn">CADASTRAR</button>
        </form>
  
        <p v-if="confirmationMessage" class="confirmation-message">
            {{ confirmationMessage }}
        </p>
    </div>
  </template>
  
  <script>
    export default{
      name: 'cadastroPassageiro',
    }
  </script>
  
  
  <script setup >

    import '../assets/css/cssCadastroMotorista.css'

    const {VITE_BASE_URL_BACKEND} = import.meta.env 

    const errorEnter = ref(false);
    const sucessEnter = ref(false);
    const userName = ref('');
    const userPhone = ref('')
    const userEmail = ref('');
    const userPassword = ref('');
    const userCpf = ref('');
    const messageError = ref('');

    async function cadastroUsuario() {
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

        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error)
        }
    }
  
  </script>
  