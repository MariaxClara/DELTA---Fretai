// Fretai/server/motorista.js

import { getMotoristaInfo } from '../componsables/motoristaService'; // Ajuste o caminho conforme necessário

export default defineEventHandler(async (event) => {
  const emailProcurado = event.req.query.email;

  if (!emailProcurado) {
    return {
      statusCode: 400,
      body: { error: 'Email não fornecido' },
    };
  }

  try {
    const motoristaInfo = await getMotoristaInfo(emailProcurado);
    return {
      statusCode: 200,
      body: motoristaInfo,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { error: error.message },
    };
  }
});
