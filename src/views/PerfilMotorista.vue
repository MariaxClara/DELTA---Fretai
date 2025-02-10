<template>
  <div class="tela-inicial">
    <!-- Cabeçalho -->
    <header class="header">
      <img src="/images/iconeImage.png" alt="Logo" class="logo" />
    </header>

    <!-- Detalhes do Motorista -->
    <div class="corrida-detalhes" style="margin: 12px">
      <img :src="driverImagePath || '/images/user.png'" alt="Motorista" class="motorista-photo" />
      <button class="botaoMotoristas">
        <p>{{ driver?.nome || 'Nome não disponível' }}</p>
      </button>
    </div>

    <!-- Informações do Motorista -->
    <div class="motorista-info">
      <p><strong>Email:</strong> {{ driver?.email || 'Não disponível' }}</p>
      <p><strong>Telefone:</strong> {{ driver?.telefone || 'Não disponível' }}</p>
      <p><strong>Placa do Veículo:</strong> {{ driver?.placa_veiculo || 'Não disponível' }}</p>
    </div>

    <!-- Botões -->
    <div class="participantes">
      <button @click="trocaDeSenha" class="botao">
        Troca de Senha
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import '../assets/css/cssRegistroUsuario.css';

const router = useRouter();
const { VITE_BASE_URL_BACKEND } = import.meta.env;

// Função para obter cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(';').shift());
  }
  return null;
}

// Pegando o email do motorista pelo cookie
const email_motorista = getCookie('userEmail');
const driverImagePath = ref(null);
const driver = ref(null);

// Função para buscar as informações do motorista
async function getDriverInfoByEmail(email) {
  try {
    const response = await fetch(`${VITE_BASE_URL_BACKEND}/driverInfo/${email}`);
    const data = await response.json();

    if (data.statusCode !== 200) {
      console.error("Erro na resposta da API:", data.body.error || 'Erro desconhecido');
      return;
    }

    driver.value = data.body;
    console.log("Dados do motorista recebidos:", driver.value);
  } catch (err) {
    console.error("Erro ao buscar informações do motorista:", err.message);
  }
}

// Função para buscar a imagem do motorista
async function fetchDriverImagePath(email) {
  try {
    const response = await fetch(`${VITE_BASE_URL_BACKEND}/imagePath/${email}`);
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

// Função para troca de senha
async function trocaDeSenha() {
  router.push("/TrocaSenha");
}

// Chamadas das funções quando o componente for montado
onMounted(() => {
  if (email_motorista) {
    getDriverInfoByEmail(email_motorista);
    fetchDriverImagePath(email_motorista);
  } else {
    console.error("Email do motorista não encontrado nos cookies.");
  }
});
</script>
