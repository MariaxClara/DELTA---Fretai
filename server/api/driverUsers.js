import connectDatabase from '../db/database';

const { getUsersByDriverID } = connectDatabase();

export default defineEventHandler(async (event) => {

  const { id } = getQuery(event);

  if (!email) {
    return { statusCode: 400, body: { error: 'Id é necessário' } };
  }

  const usersDriverInfo = await getUsersByDriverID(id);

  if (!driverInfo) {
    return { statusCode: 404, body: { error: 'Passageiros do motorista não encontrados' } };
  }

  return { statusCode: 200, body: usersDriverInfo };

});
