// server/api/login_api.js
import { loginUser } from '../db/database';

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  try {
    const user = await loginUser(email, password);

    if (user) {
      return { status: 'success', user };
    } else {
      return { status: 'error', message: 'Credenciais inválidas' };
    }
  } catch (error) {
    console.error('Erro ao logar usuário:', error.message);
    return { status: 'error', message: 'Erro no servidor' };
  }
});
