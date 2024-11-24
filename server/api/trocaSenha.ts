// server/api/updatePassword.ts
import connectDatabase from '../plugins/database';
import { H3Event, defineEventHandler, readBody } from 'h3';

interface UpdatePasswordRequest {
  email: string;
  newPassword: string;
}

interface UpdatedUser {
  id: number;
  email: string;
  name: string;
}

// Obter funções do banco de dados
const { updatePassword } = connectDatabase();

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody<UpdatePasswordRequest>(event);

    if (!body?.email || !body?.newPassword) {
      return {
        statusCode: 400,
        body: { error: 'Email e nova senha são necessários' },
      };
    }

    const result = await updatePassword(body.email, body.newPassword);
    const updatedUser: UpdatedUser | null = result ? { id: result.user_id, email: result.email, name: '' } : null;

    if (!updatedUser) {
      return {
        statusCode: 404,
        body: { error: 'Usuário não encontrado' },
      };
    }

    return {
      statusCode: 200,
      body: { message: 'Senha atualizada com sucesso', user: updatedUser },
    };
  } catch (error) {
    console.error('Erro ao atualizar senha:', (error as Error).message);
    return {
      statusCode: 500,
      body: { error: 'Erro interno do servidor' },
    };
  }
});
