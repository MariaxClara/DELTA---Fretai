<template>
    <div>

        <div class="divLogo">
            <img src="../public/images/iconeImage.png" alt="">
        </div>


        <div class="divInput">
            <input type="text" class="mainInput" placeholder="Email do participante" >
        </div>
        
        
        <div class="divButton">
            <button class="mainButton"> Convidar Cliente </button>
            <button class="mainButton">
                <NuxtLink class="mainLink" to="/myUsers">
                    Voltar
                </NuxtLink>
            </button>
        </div>
   

    </div>
</template>