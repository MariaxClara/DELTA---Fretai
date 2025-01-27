<template>
  <div class="tela-inicial">
    <!-- Cabeçalho -->
    <header class="header">
      <img src="/images/iconeImage.png" alt="Logo" class="logo" />
    </header>

    <!-- Detalhes da Corrida -->
    <div class="corrida-detalhes" style="margin: 12px">
      <img :src="driverImagePath || '/images/user.png'" alt="Motorista" class="motorista-photo" />
      <button class="botaoMotoristas">
        <p>{{ driver?.nome || 'Nome não disponível' }}</p>
      </button>
    </div>

    <!-- Botões -->
    <div class="participantes">
      <button class="botao">
        <img src="/images/MapTrifold.svg" />
        Localização
      </button>
      <button class="botao">
        <img src="/images/van.svg" alt="" />
        Corridas
      </button>
      <button class="botao">
        <img src="/images/ArrowUUpLeft.svg" alt="" />
        Voltar
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";

const { VITE_BASE_URL_BACKEND } = import.meta.env;

// Variáveis reativas
const email_passageiro = ref("passageiro2@example.com"); // Substituir para uso com cookies
const email_motorista = ref("motorista1@example.com"); // Substituir para uso com cookies
const driverImagePath = ref(null);
const driver = ref(null);

async function fetchDriverInfo() {
    try {
      const response = await fetch(`${VITE_BASE_URL_BACKEND}/driverInfo/${email_motorista.value}`);
      const data = await response.json();
      
      if (data.statusCode !== 200) {
        console.error("Erro na resposta da API:", data.body.error || 'Erro desconhecido');
        error.value = data.body.error || 'Erro desconhecido';
        return;
      }
      
      driver.value = data.body;
      error.value = null;

      console.log("Dados do motorista recebidos:", driver.value);
    } catch (err) {
      error.value = err.message;
      console.error("Erro ao buscar informações do motorista:", err.message);
    }
  }

async function fetchDriverImagePath() {
  try {
    const response = await fetch(`${VITE_BASE_URL_BACKEND}/imagePath/${email_motorista.value}`);
    const data = await response.json();

    if (data.statusCode === 200 && data.body.imagePath) {
      driverImagePath.value = data.body.imagePath;
    } else {
      console.error("Erro ao buscar a imagem:", data.body.error || "Erro desconhecido");
      driverImagePath.value = "/images/user.png"; // Fallback padrão
    }
  } catch (err) {
    console.error("Erro ao buscar o caminho da imagem:", err.message);
    driverImagePath.value = "/images/user.png"; // Fallback padrão em caso de erro
  }
}

// Buscar a imagem ao montar o componente
onMounted(() => {
  fetchDriverInfo();
  fetchDriverImagePath();
});
</script>

<style src="../assets/css/home.css"></style>