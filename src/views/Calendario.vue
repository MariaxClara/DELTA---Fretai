<template>
  <div class="wrapper">
    <header class="header">
      <img src="/images/iconeImage.png" alt="Logo" class="logo" />
    </header>

    <div class="menu">
        <!-- <button class="botao">
          <i class="icon-user"></i>
          <img src="/images/van.svg" alt="">
          Perfil
        </button> -->
        <div class="fakebutton">
          <img src="/images/van.svg" alt="">
          <i class="icon-bus"></i>
          Corridas
        </div>
      </div>

    <div class="choice">
      <span id="prev" class="arrow" @click="goToPreviousMonthWrapper">
        <img src="/images/shape_left.svg" alt="chevron_left">
      </span>
      <p class="current-date">{{ currentDate }}</p>
      <span id="next" class="arrow" @click="goToNextMonthWrapper">
        <img src="/images/shape_right.svg" alt="chevron_right">
      </span>
    </div>

    <div class="calendar">
      <ul class="weeks">
        <li v-for="day in weekDays" :key="day">{{ day }}</li>
      </ul>
      <ul class="days">
        <button v-for="day in days" :key="day.key" :class="[day.color, { 'other-month': day.key.startsWith('prev') || day.key.startsWith('next'), 'inactive': day.isPastDay || day.isWeekend }]" @click="dayChoice(day, currentMonth, currentYear)">
          {{ day.date }}
        </button>
      </ul>
    </div>

    <div class="menu">
      <!-- <button class="botao">
        <i class="icon-user"></i>
        <img src="/images/van.svg" alt="">
        Perfil
      </button> -->
      <button class="button">
        <img src="/images/van.svg" alt="">
        <i class="icon-bus"></i>
        Voltar
      </button>
    </div>

  </div>
</template>

<script setup>
import maps from "../composables/calendario.js";
import { useRoute, useRouter } from 'vue-router';
import { useTransportOptions } from '../composables/dia';

// Importa as funções do composable
const { updateCalendar, goToPreviousMonth, goToNextMonth, isMonthAllowed } = maps();
const { localData } = useTransportOptions();

// Variáveis reativas
import { ref, onMounted, watch } from 'vue';

const currentDate = ref('');
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const days = ref([]);
const router = useRouter();

// Métodos para manipulação do calendário
const updateCalendarWrapper = () => {
  ({ currentDate: currentDate.value, days: days.value } = updateCalendar(currentMonth.value, currentYear.value, localData.value));
  console.log('Updated Calendar Days:', days.value.filter(day => day.color !== 'default' && day.color !== 'inactive')); // Log the updated days array
};

const goToPreviousMonthWrapper = () => {
  ({currentMonthW: currentMonth.value, currentYearW: currentYear.value} = goToPreviousMonth(currentMonth.value, currentYear.value));
  updateCalendarWrapper();
};

const goToNextMonthWrapper = () => {
    const result = goToNextMonth(currentMonth.value, currentYear.value);
    if (result.currentMonthW === currentMonth.value && result.currentYearW === currentYear.value) {
        return; // Month change was blocked
    }
    currentMonth.value = result.currentMonthW;
    currentYear.value = result.currentYearW;
    updateCalendarWrapper();
};

// Observa mudanças no localData
watch(localData, (newValue) => {
    console.log('LocalData changed:', newValue);
    updateCalendarWrapper();
}, { deep: true });

// Atualiza quando o componente é montado
onMounted(() => {
    console.log('Calendar mounted with localData:', localData.value);
    // Verifica se o mês inicial está dentro do limite permitido
    if (!isMonthAllowed(currentMonth.value, currentYear.value)) {
        const today = new Date();
        currentMonth.value = today.getMonth();
        currentYear.value = today.getFullYear();
    }
    updateCalendarWrapper();
});

function dayChoice(day, month, year) {
    const date = new Date(year, month, day.date);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6; // 0 = Domingo, 6 = Sábado

    if (!day.active) {
        if (day.holiday) {
            alert(`O motorista não trabalha em feriados: ${day.holiday}`);
        } else if (day.isWeekend) {
            alert('O motorista não trabalha em finais de semana.');
        } else if (day.key.startsWith('prev') || day.key.startsWith('next')) {
            alert('Este dia está bloqueado porque não pertence ao mês atual.');
        } else {
            alert('Você não pode votar em viagens passadas.');
        }
        return;
    }

    router.push({
        path: '/dia',
        query: { day: day.date, month: month, year: year, flag: 1 }
    });
}
</script>


<style scoped>
  @import "../assets/css/calendario.css";

</style>
