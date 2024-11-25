import connectDatabase from '../plugins/database';
import { H3Event, defineEventHandler } from 'h3';

// Definindo o tipo de retorno da função getDriverInfoByEmail
interface DriverInfo {
  nome: string;
  email: string;
  telefone: string;
}

// Obter funções do banco de dados
const { getDriverInfoByEmail } = connectDatabase();

export default defineEventHandler(async (event: H3Event) => {
  // Obter parâmetros de consulta com tipagem
  const query = getQuery(event) as { email?: string };

  if (!query.email) {
    return {
      statusCode: 400,
      body: { error: 'Email é necessário' },
    };
  }

  try {
    const result = await getDriverInfoByEmail(query.email);
    const driverInfo: DriverInfo | null = result ? {
      nome: result.nome,
      email: result.email,
      telefone: result.telefone,
    } : null;

    if (!driverInfo) {
      return {
        statusCode: 404,
        body: { error: 'Motorista não encontrado' },
      };
    }

    return {
      statusCode: 200,
      body: driverInfo,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { error: 'Erro interno do servidor', details: (error as Error).message },
    };
  }
});
