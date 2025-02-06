<template>
    <div class="tela-inicial">
      <!-- Cabeçalho -->
      <header class="header">
        <img src="/images/iconeImage.png" alt="Logo" class="logo" />
      </header>
  
      <!-- Detalhes do Usuário -->
      <div class="usuario-detalhes" style="margin: 12px">
        <img :src="userImagePath || '/images/user.png'" alt="Usuário" class="usuario-photo" />
        <button class="botaoUsuario">
          <p>{{ usuario?.nome || 'Nome não disponível' }}</p>
        </button>
      </div>
  
      <!-- Informações do Usuário -->
      <div class="usuario-info">
        <p><strong>Email:</strong> {{ usuario?.email || 'Não disponível' }}</p>
        <p><strong>Telefone:</strong> {{ usuario?.telefone || 'Não disponível' }}</p>
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
  
  // Pegando o ID do usuário pelo cookie
  const userID = getCookie('userID');
  const email = getCookie('userEmail');

  const userImagePath = ref(null);
  const usuario = ref(null);
  
  // Função para buscar as informações do usuário pelo ID
  async function getPassengerInfoById(id) {
    try {
      const response = await fetch(`${VITE_BASE_URL_BACKEND}/passengerInfoId/${id}`);
      const data = await response.json();
  
      if (data.statusCode !== 200) {
        console.error("Erro na resposta da API:", data.body.error || 'Erro desconhecido');
        return;
      }
  
      usuario.value = data.body[0]; // Pega o primeiro resultado da lista
      console.log("Dados do usuário recebidos:", usuario.value);
    } catch (err) {
      console.error("Erro ao buscar informações do usuário:", err.message);
    }
  }
  
  // Função para buscar a imagem do usuário
  async function fetchUserImagePath(id) {
    try {
      const response = await fetch(`${VITE_BASE_URL_BACKEND}/imagePath/${email}`);
      const data = await response.json();
  
      if (data.statusCode === 200 && data.body.imagePath) {
        userImagePath.value = data.body.imagePath;
      } else {
        console.error("Erro ao buscar a imagem:", data.body.error || "Erro desconhecido");
        userImagePath.value = "/images/user.png"; // Fallback padrão
      }
    } catch (err) {
      console.error("Erro ao buscar o caminho da imagem:", err.message);
      userImagePath.value = "/images/user.png"; // Fallback padrão em caso de erro
    }
  }
  
  // Função para troca de senha
  async function trocaDeSenha() {
    router.push("/TrocaSenha");
  }
  
  // Chamadas das funções quando o componente for montado
  onMounted(() => {
    if (userID) {
      getPassengerInfoById(userID);
      fetchUserImagePath(userID);
    } else {
      console.error("ID do usuário não encontrado nos cookies.");
    }
  });
  </script>
  
  <style src="../assets/css/perfil.css"></style>
  