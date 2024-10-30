import connectDatabase from '../plugins/database';

const { getDriverInfoByEmail } = connectDatabase();

export default defineEventHandler(async (event) => {
  // Usar getQuery para obter parâmetros de consulta no Nuxt 3
  const { email } = getQuery(event);

  if (!email) {
    return { statusCode: 400, body: { error: 'Email é necessário' } };
  }

  const driverInfo = await getDriverInfoByEmail(email);

  if (!driverInfo) {
    return { statusCode: 404, body: { error: 'Motorista não encontrado' } };
  }

  return { statusCode: 200, body: driverInfo };
});
