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
        <div v-if="selectedOption">
            <h3>Alunos que votaram para {{ selectedOption }}:</h3>
            <ul>
                <li v-for="student in filteredStudents" :key="student.id">{{ student.name }}</li>
            </ul>
        </div>
        <div>
            <button class="confirm-button" @click="goBackToCalendar">
                <router-link :to="{name: 'Calendario'}" class="mainLink">VOLTAR</router-link>
            </button>
        </div>
    </div>
</template>

<script setup>
    import { useRoute, useRouter } from 'vue-router';
    import { ref, computed } from 'vue';

    const route = useRoute();
    const router = useRouter();
    const dia = ref(route.query.day || 'aeiou');
    const mes = ref(Number(route.query.month) + 1 || 'uoiea');
    const ano = ref(route.query.year || 'aeiou');

    const options = ['Ida 8h', 'Volta 17h30', 'Não vai em nenhum horário'];
    const selectedOption = ref('');

    const students = ref([
        { id: 1, name: 'Aluno 1', ida: 1, volta: 1 },
        { id: 2, name: 'Aluno 2', ida: 1, volta: 0 },
        { id: 3, name: 'Aluno 3', ida: 0, volta: 1 },
        { id: 4, name: 'Aluno 4', ida: 0, volta: 0 },
        // ... more students
    ]);

    const selectOption = (option) => {
        if (selectedOption.value === option) {
            selectedOption.value = '';
        } else {
            selectedOption.value = option;
        }
    };

    const filteredStudents = computed(() => {
        if (selectedOption.value === 'Ida 8h') {
            return students.value.filter(student => student.ida === 1);
        } else if (selectedOption.value === 'Volta 17h30') {
            return students.value.filter(student => student.volta === 1);
        } else if (selectedOption.value === 'Nenhum horário') {
            return students.value.filter(student => student.ida === 0 && student.volta === 0);
        } else {
            return [];
        }
    });

    const goBackToCalendar = () => {
        router.push({ name: 'Calendario' });
    };
</script>

<style scoped>
  @import "../assets/css/votacao.css";

</style>