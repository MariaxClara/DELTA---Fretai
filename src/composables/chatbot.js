import axios from "axios";

// Acessa a variável de ambiente diretamente
const apiKey = import.meta.env.VITE_CHATBOT_API_KEY; 
const apiUrl = "https://api.openai.com/v1/chat/completions";

/**
 * Envia uma pergunta para a API do ChatGPT e retorna a resposta.
 * @param {string} userQuestion - Pergunta do usuário.
 * @param {Array} chatHistory - Histórico do chat (array de mensagens).
 * @returns {Promise<string>} - Resposta da API.
 */
export async function getChatResponse(userQuestion, chatHistory) {
  // Define o contexto inicial para o chatbot
  const initialContext = `Bem-vindo ao Fretai!
O Fretai é uma aplicação inovadora, projetada para facilitar a reserva de caronas de
van, eliminando a necessidade de grupos desorganizados em aplicativos de
mensagens como o WhatsApp. Desenvolvida a partir de 2024, a plataforma possui um
design moderno, com uma interface predominantemente azulada, que transmite
profissionalismo e simplicidade.
A equipe de desenvolvimento, composta por Vitor, Maria Clara, Pedro Figueiredo, Tiago
Izumi, Thiago, Marcos Aquino, Maria Clara Couto e Daniel Martins, vem trabalhando
incansavelmente para entregar uma solução eficiente e prática.
Atualmente em fase de testes, o Fretai já conta com algumas funcionalidades básicas
que prometem transformar a experiência de seus usuários:
Registro de usuários: Permite criar contas para acessar o sistema.
Mapa da rota: Visualize as rotas disponíveis de forma clara e intuitiva.
Controle de caronas: Organize e acompanhe as caronas de maneira prática.
Login: Acesse sua conta com segurança.
Recuperação de login por e-mail: Facilita o acesso em caso de esquecimento de
credenciais.
O chatbot do Fretai está aqui para responder suas dúvidas e ajudá-lo a explorar todas
as funcionalidades da aplicação. Estamos empolgados em tornar sua experiência com
caronas mais organizada, confiável e acessível!
Se precisar de ajuda, é só perguntar!`;

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
