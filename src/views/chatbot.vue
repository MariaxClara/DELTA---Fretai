<template>
  <div id="chatbot">
    <!-- Cabeçalho com a imagem do logo -->
    <header class="header-chatbot">
      <img src="/images/iconeImage.png" alt="Logo" class="logo-chatbot" />
      <h1>Chat de Suporte </h1>
    </header>

    <!-- Janela de chat -->
    <div class="chat-window">
      <div
        v-for="(message, index) in chatHistory"
        :key="index"
        :class="['chat-message', message.sender === 'Você' ? 'user' : 'assistant']"
      >
        <strong>{{ message.sender }}:</strong> {{ message.text }}
      </div>
    </div>

    <!-- Input de mensagem -->
    <div class="chat-input">
      <input
        v-model="userInput"
        type="text"
        placeholder="Digite sua pergunta..."
        @keypress.enter="sendMessage"
      />
      <button @click="sendMessage">Enviar</button>
    </div>
  </div>
</template>

<script>
import { getChatResponse } from "../composables/chatbot";

export default {
  data() {
    return {
      userInput: "",
      chatHistory: [], // Inicializa o histórico vazio
    };
  },
  mounted() {
    // Adiciona a mensagem inicial ao histórico quando o componente é carregado
    this.chatHistory.push({
      sender: "Chatbot",
      text: "Eu sou o chatbot do Fretai, como posso ajudar?",
    });
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim()) return;

      // Adiciona a mensagem do usuário ao histórico
      this.chatHistory.push({ sender: "Você", text: this.userInput });

      try {
        // Envia a pergunta para o Chatbot e recebe a resposta
        const response = await getChatResponse(this.userInput, this.chatHistory);
        this.chatHistory.push({ sender: "Chatbot", text: response });
      } catch (error) {
        console.error("Erro ao gerar resposta:", error);
        this.chatHistory.push({ sender: "Chatbot", text: "Desculpe, algo deu errado. Tente novamente." });
      }

      // Limpa o campo de entrada após o envio
      this.userInput = "";
    },
  },
};
</script>

<!-- Estilo externo -->
<style src="../assets/css/chatbot.css"></style>
