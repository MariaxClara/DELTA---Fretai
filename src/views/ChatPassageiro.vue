<template>
  <div class="chat-container">
    <div class="messages-wrapper">
      <div v-for="message in messages" :key="message.mensagem_id" class="message-wrapper">
        <div :class="{
          'my-message': message.remetente_id == senderId,
          'other-message': message.remetente_id != senderId
        }">
          <p class="message-content">{{ message.conteudo }}</p>
          <small class="message-time">{{ new Date(message.created_at).toLocaleTimeString() }}</small>
        </div>
      </div>
    </div>

    <div class="message-input">
      <input
        type="text"
        v-model="newMessage"
        placeholder="Digite sua mensagem..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">Enviar</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      senderId: null, // Será definido a partir da URL
      receiverId: null, // Será definido a partir da URL
      newMessage: '', // Nova mensagem a ser enviada
      messages: [], // Histórico de mensagens carregado do backend
    };
  },
  methods: {
    async fetchMessages() {
      console.log('SenderId:', this.senderId);
      console.log('ReceiverId:', this.receiverId);
      try {
        const { VITE_BASE_URL_BACKEND } = import.meta.env;
        const response = await fetch(`${VITE_BASE_URL_BACKEND}/chat/${this.senderId}/${this.receiverId}`);
        if (response.ok) {
          const data = await response.json();
          this.messages = data; // Atualiza o histórico de mensagens
        } else {
          console.error('Erro ao buscar mensagens:', await response.text());
        }
      } catch (error) {
        console.error('Erro de rede ao buscar mensagens:', error);
      }
    },
    async sendMessage() {
      if (!this.newMessage.trim()) return;

      const messageData = {
        senderId: this.senderId,
        receiverId: this.receiverId,
        content: this.newMessage,
      };

      try {
        const { VITE_BASE_URL_BACKEND } = import.meta.env;
        const response = await fetch(`${VITE_BASE_URL_BACKEND}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        });

        if (response.ok) {
          const data = await response.json();
          this.messages.push(data);
          this.newMessage = '';
        } else {
          console.error('Erro ao enviar mensagem:', await response.text());
        }
      } catch (error) {
        console.error('Erro de rede ao enviar mensagem:', error);
      }
    },
  },
  mounted() {
    // Obtém os parâmetros da URL
    this.senderId = this.$route.params.senderId;
    this.receiverId = this.$route.params.receiverId;

    console.log('SenderId:', this.senderId);
    console.log('ReceiverId:', this.receiverId);

    // Busca as mensagens assim que o componente é montado
    this.fetchMessages();
  },
};
</script>

<style scoped>
/* Layout do chat */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
  align-items: center; /* Centraliza o conteúdo */
}

/* Container das mensagens */
.messages-wrapper {
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px; /* Limita a largura das mensagens */
}

/* Estilo de cada mensagem */
.message-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  width: 100%;
}

/* Mensagem do motorista (azul) */
.my-message {
  align-self: flex-end;
  background-color: #007bff;
  color: black; /* Texto preto */
  padding: 16px 20px; /* Aumenta o tamanho das mensagens */
  border-radius: 16px;
  max-width: 70%;
  text-align: left;
  font-size: 18px; /* Aumenta o tamanho da fonte */
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.1);
}

/* Mensagem do passageiro (branca com contorno preto) */
.other-message {
  align-self: flex-start;
  background-color: white;
  color: black;
  padding: 16px 20px; /* Aumenta o tamanho das mensagens */
  border-radius: 16px;
  max-width: 70%;
  border: 2px solid black;
  text-align: left;
  font-size: 18px; /* Aumenta o tamanho da fonte */
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.1);
}

/* Ajusta a cor do horário das mensagens do passageiro */
.other-message .message-time {
  color: black !important;
}

.other-message .message-content {
  color: black !important;
}

/* Ajusta a cor do horário das mensagens do motorista */
.my-message .message-time {
  color: white !important;
}

/* Campo de entrada da mensagem */
.message-input {
  display: flex;
  align-items: center;
  padding: 10px;
  background: white;
  border-top: 1px solid #ccc;
  width: 100%;
  max-width: 800px;
}

/* Input de mensagem */
.message-input input {
  flex-grow: 1;
  padding: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}

/* Botão de envio */
.message-input button {
  padding: 14px 24px;
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

/* Efeito hover no botão */
.message-input button:hover {
  background-color: #0056b3;
}

</style>
