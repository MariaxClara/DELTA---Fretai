<template>
    <div class="chat-container">
      <header class="chat-header">
        <h1 class="chat-title">Chat</h1>
      </header>
  
      <div class="chat-messages">
        <div v-for="message in messages" :key="message.id" :class="{'my-message': message.isMine, 'other-message': !message.isMine}">
          <p class="message-content">{{ message.content }}</p>
          <span class="message-timestamp">{{ message.timestamp }}</span>
        </div>
      </div>
  
      <form class="chat-input-container" @submit.prevent="sendMessage">
        <input 
          type="text" 
          v-model="newMessage" 
          placeholder="Digite sua mensagem..." 
          class="chat-input" 
          required
        >
        <button type="submit" class="send-button">Enviar</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const messages = ref([]);
  
  const newMessage = ref('');
  
  const sendMessage = () => {
    if (newMessage.value.trim()) {
      messages.value.push({
        id: Date.now(),
        content: newMessage.value,
        isMine: true,
        timestamp: new Date().toLocaleTimeString(),
      });
      newMessage.value = '';
    }
  };
  </script>
  
  <style scoped>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    background-color: #f5f5f5;
  }
  
  .chat-header {
    padding: 1rem;
    background-color: #007bff;
    color: #fff;
    text-align: center;
  }
  
  .chat-title {
    margin: 0;
    font-size: 1.5rem;
  }
  
  .chat-messages {
    flex-grow: 1;
    padding: 1rem;
    overflow-y: auto;
    background-color: #ffffff;
  }
  
  .my-message {
    align-self: flex-end;
    background-color: #007bff;
    color: #fff;
    border-radius: 10px;
    padding: 0.5rem 1rem;
    margin: 0.5rem 0;
    max-width: 60%;
  }
  
  .other-message {
    align-self: flex-start;
    background-color: #f1f1f1;
    color: #000;
    border-radius: 10px;
    padding: 0.5rem 1rem;
    margin: 0.5rem 0;
    max-width: 60%;
  }
  
  .message-content {
    margin: 0;
  }
  
  .message-timestamp {
    font-size: 0.75rem;
    text-align: right;
    display: block;
  }
  
  .chat-input-container {
    display: flex;
    padding: 1rem;
    background-color: #f1f1f1;
    border-top: 1px solid #ccc;
  }
  
  .chat-input {
    flex-grow: 1;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
    color: #000

  }
  
  .send-button {
    margin-left: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    background-color: #007bff;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .send-button:hover {
    background-color: #0056b3;
  }
  </style>
  