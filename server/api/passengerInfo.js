// server/api/passengerInfo.js
import connectDatabase from '../plugins/database';

const { getPassengerInfoByEmail } = connectDatabase();

export default defineEventHandler(async (event) => {
  const { email } = getQuery(event);

  if (!email) {
    return { statusCode: 400, body: { error: 'Email é necessário' } };
  }

  const passengerInfo = await getPassengerInfoByEmail(email);

  if (!passengerInfo) {
    return { statusCode: 404, body: { error: 'Passageiro não encontrado' } };
  }

  return { statusCode: 200, body: passengerInfo };
});
