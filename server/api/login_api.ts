// server/api/login_api.ts
import { loginUser, getUserType } from '../db/database';
import { defineEventHandler } from 'h3';

interface LoginResponse {
  status: string;
  user?: any;
  message?: string;
}



export default defineEventHandler(async (event): Promise<LoginResponse> => {
  const { email, password } = await readBody(event);

  try {
    const user = await loginUser(email, password);

    if (user) {
      return { status: 'success', user };
    } else {
      return { status: 'error', message: 'Credenciais inválidas' };
    }
  } catch (error: any) {
    console.error('Erro ao logar usuário:', error.message);
    return { status: 'error', message: 'Erro no servidor' };
  }
});

