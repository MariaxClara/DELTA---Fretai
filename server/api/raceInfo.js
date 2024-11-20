// server/api/raceInfo.js
import connectDatabase from '../plugins/database';

const { getRaceInfoByEmail } = connectDatabase();

export default defineEventHandler(async (event) => {
  const { email } = getQuery(event);

  if (!email) {
    return { statusCode: 400, body: { error: 'Email é necessário' } };
  }

  const raceInfo = await getRaceInfoByEmail(email);

  if (!raceInfo) {
    return { statusCode: 404, body: { error: 'Corrida não encontrada para o passageiro' } };
  }

  return { statusCode: 200, body: raceInfo };
});
