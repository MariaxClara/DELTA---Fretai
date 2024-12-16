<template>
  <div class="chat-container">
    <div v-for="message in messages" :key="message.mensagem_id" class="message">
      <div :class="{
        'my-message': message.remetente_id == senderId,
        'other-message': message.remetente_id != senderId
      }">
        <p>{{ message.conteudo }}</p>
        <small>{{ new Date(message.created_at).toLocaleTimeString() }}</small>
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
        const response = await fetch(`http://localhost:3000/chat/${this.senderId}/${this.receiverId}`);
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
        const response = await fetch('http://localhost:3000/chat', {
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

<style>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
}

.message {
  margin-bottom: 10px;
}

.my-message {
  align-self: flex-end;
  background-color: #5fb350; /* Verde claro */
  padding: 10px;
  border-radius: 8px;
  max-width: 60%;
  text-align: right;
}

.other-message {
  align-self: flex-start;
  background-color: #5483b6; /* Azul claro */
  padding: 10px;
  border-radius: 8px;
  max-width: 60%;
  text-align: left;
}

.message-input {
  display: flex;
  align-items: center;
  margin-top: auto;
  color: #000;
}

.message-input input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #000;

}

.message-input button {
  padding: 10px;
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.message-input button:hover {
  background-color: #0056b3;
  color: #000;

}
</style>
