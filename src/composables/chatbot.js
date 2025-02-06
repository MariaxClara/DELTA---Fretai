import axios from "axios";

// Acessa a variável de ambiente diretamente
const apiKey = import.meta.env.VITE_CHATBOT_API_KEY; 
const apiUrl = "https://api.openai.com/v1/chat/completions";
const { VITE_BASE_URL_BACKEND } = import.meta.env;

const response = await fetch(`${VITE_BASE_URL_BACKEND}/driverInfoChatBot`);
const travelData = await response.json(); // Obtém os dados das viagens

/**
 * Envia uma pergunta para a API do ChatGPT e retorna a resposta.
 * @param {string} userQuestion - Pergunta do usuário.
 * @param {Array} chatHistory - Histórico do chat (array de mensagens).
 * @returns {Promise<string>} - Resposta da API.
 */
export async function getChatResponse(userQuestion, chatHistory) {
  // Filtra as viagens pelo dia solicitado
  const userDay = userQuestion.toLowerCase().match(/segunda|terça|quarta|quinta|sexta|sábado|domingo/);
  const filteredTravelData = userDay ? travelData.body.filter(travel => travel.dia_da_semana.toLowerCase() === userDay[0]) : travelData.body;

  // Formata os dados das viagens
  const formattedTravelData = filteredTravelData.length > 0 ? filteredTravelData.map(travel => (
    `\n**Viagem Disponível:**\n- **Motorista:** ${travel.motorista_nome}\n- **Telefone:** ${travel.motorista_telefone}\n- **Destino:** ${travel.destino}\n- **Horário:** ${travel.horario}\n- **Dia:** ${travel.dia_da_semana}\n`
  )).join("\n") : "Não há viagens disponíveis para o dia solicitado.";

  // Define o contexto inicial para o chatbot
  const initialContext = `Bem-vindo ao Fretai!

O Fretai é um chatbot de suporte exclusivo para dúvidas sobre o aplicativo e informações sobre viagens disponíveis. Caso sua pergunta esteja fora desse contexto, não poderei ajudar. **Se alguma pergunta não estiver relacionada ao Fretai ou às viagens, por favor, não responda de forma alguma. Apenas reforce que não pode ajudar.**

### Funcionalidades do Fretai
- Registro de usuários: Criação de contas para acessar o sistema.
- Mapa da rota: Visualização clara das rotas disponíveis.
- Controle de caronas: Organização e acompanhamento das viagens.
- Login seguro: Acesso protegido ao sistema.
- Recuperação de conta: Recuperação de login via e-mail.

### Indicação de Corridas
Além de tirar dúvidas sobre o Fretai, posso te ajudar a encontrar a melhor carona disponível.

Basta me informar o **dia da semana** e o **horário desejado**, e eu compararei com as viagens cadastradas no sistema para sugerir a melhor opção para você.

${formattedTravelData}

Se quiser saber qual corrida melhor atende sua necessidade, me diga o dia e o horário desejado! 🚐💨`;

  // Verifica se o histórico de chat está vazio e adiciona uma mensagem inicial
  if (chatHistory.length === 0) {
    chatHistory.push({
      sender: "Chatbot",
      text: "Eu sou o chatbot do Fretai, como posso ajudar?",
    });
  }

  // Converte o histórico de chat no formato correto da API
  const messages = chatHistory.map((entry) => ({
    role: entry.sender === "Você" ? "user" : "assistant",
    content: entry.text,
  }));

  // Adiciona o contexto inicial (mensagem de sistema) ao início do histórico
  messages.unshift({
    role: "system", // Role "system" é usada para fornecer instruções ao modelo
    content: initialContext,
  });

  // Adiciona a nova pergunta do usuário ao histórico
  messages.push({
    role: "user",
    content: userQuestion,
  });

  // Configura o payload para enviar à API
  const payload = {
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.7,
  };

  // Configura o header para a requisição
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  try {
    // Envia a requisição para a API OpenAI
    const response = await axios.post(apiUrl, payload, { headers });
    // Retorna a resposta da API (o conteúdo gerado)
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    // Exibe o erro detalhado no console
    console.error("Erro ao chamar a API:", error.response?.data || error.message);
    throw new Error("Não foi possível gerar a resposta.");
  }
}