import connectDatabase from '../plugins/database';

const { changeRaceStatus } = connectDatabase();

export default defineEventHandler(async (event) => {
  // Obter o corpo da requisição no Nuxt 3 com `readBody`
  const body = await readBody(event);

  const { rota_id, passageiro_id, status_corrida } = body;

  // Validar os dados recebidos
  if (!rota_id || !passageiro_id || status_corrida === undefined) {
    return { statusCode: 400, body: { error: "Dados incompletos. Certifique-se de enviar 'rota_id', 'passageiro_id' e 'status_corrida'." } };
  }

  try {
    // console.log("Log de verificação dos parâmetros:");
    // console.log("rota_id:", rota_id);
    // console.log("passageiro_id:", passageiro_id);
    // console.log("status_corrida:", status_corrida);

    // Chamar a função para alterar o status no banco de dados
    const result = await changeRaceStatus(rota_id, passageiro_id, status_corrida);

    console.log("Resultado da atualização do status da corrida API:", result);
    // Retornar a mensagem de sucesso
    return { statusCode: 200, body: { message: result } };
  } catch (error) {
    console.error("Erro ao atualizar o status da corrida:", error.message);

    // Retornar mensagem de erro
    return { statusCode: 500, body: { error: "Erro interno ao processar a solicitação." } };
  }
});
