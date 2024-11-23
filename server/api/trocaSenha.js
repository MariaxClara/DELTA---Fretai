import connectDatabase from '../plugins/database';

const { updatePassword } = connectDatabase();

export default defineEventHandler(async (event) => {
  // Obter os parâmetros da requisição (Nuxt 3 usa getBody ou getQuery dependendo do tipo)
  const { email, newPassword } = await readBody(event); // No caso de uma requisição POST com dados no corpo

  if (!email || !newPassword) {
    return { statusCode: 400, body: { error: 'Email e nova senha são necessários' } };
  }

  // Atualiza a senha no banco de dados
  const updatedUser = await updatePassword(email, newPassword);

  if (!updatedUser) {
    return { statusCode: 404, body: { error: 'Usuário não encontrado' } };
  }

  return { statusCode: 200, body: { message: 'Senha atualizada com sucesso', user: updatedUser } };
});
