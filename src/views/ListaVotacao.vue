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
            <div v-for="option in options" :key="option.id" class="option-container">
                <button 
                    @click="selectOption(option.id)"
                    :class="{ selected: selectedOption === option.id }"
                >
                    {{ option.label }}
                </button>
                <div v-if="selectedOption === option.id" class="student-list">
                    <ul>
                        <li v-for="student in filteredStudents" :key="student.id">{{ student.name }}</li>
                    </ul>
                </div>
            </div>
            <div class="confirm-button-container">
                <button class="confirm-button" @click="goBackToCalendar">
                    <router-link :to="{name: 'Calendario'}" class="mainLink">VOLTAR</router-link>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useRoute, useRouter } from 'vue-router';
    import { ref, computed } from 'vue';
    import { horarios, getAlunosPorHorario } from '../composables/votacao.js';

    const route = useRoute();
    const router = useRouter();
    const dia = ref(route.query.day || 'aeiou');
    const mes = ref(Number(route.query.month) + 1 || 'uoiea');
    const ano = ref(route.query.year || 'aeiou');

    const options = horarios;
    const selectedOption = ref('');

    const selectOption = (optionId) => {
        if (selectedOption.value === optionId) {
            selectedOption.value = '';
        } else {
            selectedOption.value = optionId;
        }
    };

    const filteredStudents = computed(() => {
        return getAlunosPorHorario(selectedOption.value);
    });

    const goBackToCalendar = () => {
        router.push({ name: 'Calendario' });
    };
</script>

<style scoped>
  @import "../assets/css/votacao.css";

</style>