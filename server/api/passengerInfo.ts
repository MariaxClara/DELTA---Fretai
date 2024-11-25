// server/api/passengerInfo.ts
import connectDatabase from '../plugins/database';
import { H3Event, defineEventHandler } from 'h3';

interface PassengerInfo {
  name: string;
  email: string;
  phone: string;
}

const { getPassengerInfoByEmail } = connectDatabase();

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event) as { email?: string };

  if (!query.email) {
    return {
      statusCode: 400,
      body: { error: 'Email é necessário' },
    };
  }

  try {
    const dbResult = await getPassengerInfoByEmail(query.email);
    const passengerInfo: PassengerInfo | null = dbResult ? {
      name: dbResult[0].passageiro_nome,
      email: dbResult[0].passageiro_email,
      phone: dbResult[0].passageiro_telefone,
    } : null;

    if (!passengerInfo) {
      return {
        statusCode: 404,
        body: { error: 'Passageiro não encontrado' },
      };
    }

    return {
      statusCode: 200,
      body: passengerInfo,
    };
  } catch (error) {
    console.error('Erro ao buscar informações do passageiro:', (error as Error).message);
    return {
      statusCode: 500,
      body: { error: 'Erro interno do servidor' },
    };
  }
});
