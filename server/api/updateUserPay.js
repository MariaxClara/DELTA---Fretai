import connectDatabase from '../plugins/database';

const { updatePay } = connectDatabase();

export default defineEventHandler(async (event) => {

  const { email, paid } =  await readBody(event);

  if (!email) {
    return { statusCode: 400, body: { error: 'Email é necessário' } };
  }
  if (paid==null) {
    return { statusCode: 400, body: { error: 'Confirmação de pagamento é necessário' } };
  }

  const res = await updatePay(email, paid);

  if (!res) {
    return { statusCode: 404, body: { error: 'Motorista não encontrado' } };
  }

  return { statusCode: 200, body: { message: 'success' } };
});
