<!-- pages/index.vue -->
<template>
    <div>
      <h1>Página inicial</h1>
      <h2>Tabelas do Banco de Dados</h2>
      <ul>
        <li v-for="table in tables" :key="table">{{ table }}</li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const tables = ref([]);
  
  onMounted(async () => {
    try {
      const response = await fetch('/api/tables');
      tables.value = await response.json();
    } catch (error) {
      console.error('Erro ao buscar tabelas:', error.message);
    }
  });
  </script>
  