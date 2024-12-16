<template>
    <div class="container">
        <header class="header">
            <img src="/images/iconeImage.png" alt="Logo" class="logo" />
        </header>
        <div class="transport-card">
            <img src="/images/CalendarCheck.svg" alt="">
            <i class="icon-bus"></i>
            Transporte {{ dia }}/{{ mes }}
        </div>
        <div class="options">
            <button v-for="option in options" 
                :key="option" 
                @click="selectOption(option)"
                :class="{ selected: selectedOption === option }"
            >
                {{ option }}
            </button>
        </div>
        <div>
            <button class="confirm-button" @click="confirmSelection(dia, mes, ano, rota, user)">
                <router-link :to="{name: 'Calendario'}" class="mainLink">CONFIRMAR</router-link>
            </button>
        </div>
    </div>
</template>

<script setup>
    import { useTransportOptions } from '../composables/dia.js';
    import { useRoute, useRouter } from 'vue-router';
    import { ref, onMounted } from 'vue';

    const route = useRoute();
    const router = useRouter();
    const dia = ref(route.query.day || 'aeiou');
    const mes = ref(Number(route.query.month) + 1 || 'uoiea');
    const ano = ref(route.query.year || 'aeiou');
    const rota =  ref(1); //valor exemplo
    const user = ref(1); //valor exemplo

    const { options, selectedOption, selectOption, confirmSelection } = useTransportOptions();

    
</script>

<style scoped>
  @import "../assets/css/dia.css";

</style>