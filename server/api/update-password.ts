// Correções em update-password.ts
import { updatePassword } from '../db/database';
import { defineEventHandler } from 'h3';

interface UpdatePasswordResponse {
  status: string;
  message?: string;
}

export default defineEventHandler(async (event): Promise<UpdatePasswordResponse> => {
  const { email, newPassword, confirmPassword } = await readBody(event);
  console.log(confirmPassword)
  console.log(newPassword)
  console.log(email)


  if (newPassword !== confirmPassword) {
    return { status: 'error', message: 'As senhas não coincidem' };
  }

  try {
    const updateResult = await updatePassword(email, newPassword);

    if (updateResult) {
      return { status: 'success', message: 'Senha atualizada com sucesso' };
    } else {
      return { status: 'error', message: 'Usuário não encontrado ou erro ao atualizar senha' };
    }
  } catch (error: any) {
    console.error('Erro ao atualizar senha:', error.message);
    return { status: 'error', message: 'Erro no servidor' };
  }
});
