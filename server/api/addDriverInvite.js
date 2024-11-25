import connectDatabase from '../plugins/database';

const { addUserEmailInvite } = connectDatabase();

export default defineEventHandler(async (event) => {

  const { email, id } =  await readBody(event);

  if (!email) {
    return { statusCode: 400, body: { error: 'Email é necessário' } };
  }
  if (id==null) {
    return { statusCode: 400, body: { error: 'Id do motorista é necessário' } };
  }

  const res = await addUserEmailInvite(email, id);

  if (!res) {
    return { statusCode: 404, body: { error: 'Não foi possivel atualizar os convites enviados' } };
  }

  return { statusCode: 200, body: { message: 'success' } };
});
