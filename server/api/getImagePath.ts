// server/api/getImagePath.ts
import connectDatabase from '../plugins/database';
import { H3Event, defineEventHandler } from 'h3';

interface ImagePathResponse {
  imagePath: string;
}

// Obter funções do banco de dados
const { getImagePathByUser } = connectDatabase();

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event) as { email?: string };

  if (!query.email) {
    return {
      statusCode: 400,
      body: { error: 'Email é necessário' },
    };
  }

  try {
    const imagePath: string | null = await getImagePathByUser(query.email);

    if (!imagePath) {
      return {
        statusCode: 404,
        body: { error: 'Imagem não encontrada' },
      };
    }

    return {
      statusCode: 200,
      body: { imagePath } as ImagePathResponse,
    };
  } catch (error) {
    console.error('Erro ao buscar o caminho da imagem:', (error as Error).message);
    return {
      statusCode: 500,
      body: { error: 'Erro interno do servidor' },
    };
  }
});
