<template>
    <div id="calendar-app">
  
      <!-- Nuvens -->
      <div class="clouds">
        <div class="cloud" id="cloud1"></div>
        <div class="cloud" id="cloud2"></div>
      </div>
  
      <!-- Botões -->
      <div class="buttons">
        <div class="button" id="back">
          <span>VOLTAR</span>
        </div>
      </div>
  
      <!-- Calendário -->
      <div class="datepicker">
        <div class="shape"></div>
        <div class="days">
          <span class="day" v-for="(day, index) in weekDays" :key="index">{{ day }}</span>
        </div>
        <div class="dates">
          <span v-for="date in dates" :key="date" class="date">{{ date }}</span>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: "Calendario",
  };
  </script>
  
  <style src="../assets/css/calendario.css">
</style>
