import connectDatabase from '../plugins/database';

const { pool } = connectDatabase();

export default defineEventHandler(async (event) => {
    const { rota_id } = getQuery(event);

    if (!rota_id) {
        return { statusCode: 400, body: { error: "rota_id é necessário" } };
    }

    try {
        const client = await pool.connect();

        // Consulta o status mais recente da corrida
        const query = `
            SELECT status 
            FROM log_passageiro_rotas 
            WHERE rota_id = $1 
            ORDER BY created_at DESC 
            LIMIT 1
        `;
        const result = await client.query(query, [rota_id]);
        client.release();

        if (result.rows.length === 0) {
            return { statusCode: 404, body: { error: "Status não encontrado para a rota_id fornecida" } };
        }

        const status = result.rows[0].status;

        // Retorna o status mais recente
        // console.log('rota',rota_id);
        // console.log("Status da corridaaaaaaaaaa encontrado:", status);
        return status;
    } catch (error) {
        console.error("Erro ao buscar o status da corrida:", error.message);
        return { statusCode: 500, body: { error: "Erro interno ao processar a solicitação." } };
    }
});
