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
        :class="[
          'chat-message',
          message.sender === 'Você' ? 'user' : 'assistant'
        ]"
      >
        <strong>{{ message.sender }}:</strong> {{ message.text }}
      </div>
    </div>

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
      chatHistory: [],
    };
  },
  mounted() {
    // Mensagem inicial quando o componente carrega
    this.chatHistory.push({
      sender: "Chatbot",
      text: "Eu sou o chatbot do Fretai, como posso ajudar?",
    });
  },
  methods: {
    sendMessage() {
      if (!this.userInput.trim()) return;

      // Adiciona a mensagem do usuário no histórico
      this.chatHistory.push({ sender: "Você", text: this.userInput });

      // Chama a função do chatbot usando .then() e .catch() em vez de await
      getChatResponse(this.userInput, this.chatHistory)
        .then((response) => {
          this.chatHistory.push({ sender: "Chatbot", text: response });
        })
        .catch((error) => {
          console.error("Erro ao gerar resposta:", error);
          this.chatHistory.push({
            sender: "Chatbot",
            text: "Desculpe, algo deu errado. Tente novamente.",
          });
        });

      // Limpa o campo de texto
      this.userInput = "";
    },
  },
};
</script>

<style src="../assets/css/chatbot.css"></style>
