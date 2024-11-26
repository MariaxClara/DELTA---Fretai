// server/api/getImagePath.js
import connectDatabase from '../db/database';

const { getImagePathByUser } = connectDatabase();

export default defineEventHandler(async (event) => {
  // Obtém o parâmetro de consulta "email" do evento
  const { email } = getQuery(event);

  if (!email) {
    return { statusCode: 400, body: { error: 'Email é necessário' } };
  }

  try {
    const imagePath = await getImagePathByUser(email);

    if (!imagePath) {
      return { statusCode: 404, body: { error: 'Imagem não encontrada' } };
    }

    return { statusCode: 200, body: { imagePath } };
  } catch (error) {
    console.error('Erro ao buscar o caminho da imagem:', error.message);
    return { statusCode: 500, body: { error: 'Erro interno do servidor' } };
  }
});
