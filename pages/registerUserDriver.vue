<template>
    <div>

        <div class="divLogo">
            <img src="../public/images/iconeImage.png" alt="">
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
                <NuxtLink class="mainLink" to="/myUsers">
                    Voltar
                </NuxtLink>
            </button>
        </div>
   

    </div>
</template>

<script>
    import { ref, onMounted } from 'vue'
    import axios from 'axios'
    import { sendWelcomeEmail } from '../composables/sendEmail'

    export default {

        async setup() {

            const driverName = ref('João Motorista Legal');
            const errorInvite = ref(false);
            const sucessInvite = ref(false);
            const errorMessage = ref('');
            const userEmails = ref([])
            const userEmail = ref('');

            //Melhorar a ReEx para mais especificidade
            const reEmail = new RegExp(".+@.+");

            userEmails.value = ["cla@uni.com", "mar@uni.com"]

            async function addUser(email) {
                // Adicionar no banco
                try {
                    response = await axios.post(`addEmailUser/${email}`)
                    console.log(response)    
                    userEmails.value.push(email)

                } catch (error) {
                    messageError.value = 'Parece que nosso servidor está em manutenção, não foi possível convidar o usuário!'
                    console.log(messageError)
                }
            }

            async function takeUsers () {
                let response = { data: {} }
      
                try {
                    response = await axios.get(`driverInfo/${driverName.value}`)
                    console.log(response)
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
                            sendWelcomeEmail(userEmail.value, driverName, 'https://www.google.com/')
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

            return {
                inviteUser,
                errorInvite,
                sucessInvite,
                errorMessage,
                userEmail
            }

        }

    }


</script>