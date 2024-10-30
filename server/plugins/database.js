// server/plugins/database.js
import pkg from 'pg';
const { Pool } = pkg;

export default function () {
  const pool = new Pool({
    user: 'postgres',
    host: '',
    database: 'postgres',
    password: '',
    port: 5432,
    ssl: {
      rejectUnauthorized: false,
    },
  });

// Função para buscar informações do motorista pelo email
async function getDriverInfoByEmail(email) {
  try {
    const client = await pool.connect();

    // Primeira consulta para obter o user_id e email do usuário
    const userRes = await client.query(
      `SELECT user_id, email 
       FROM users 
       WHERE email = $1`, 
      [email]
    );

    if (userRes.rows.length === 0) {
      client.release();
      console.log("Usuário não encontrado.");
      return null; // Retorna null se o usuário não for encontrado
    }

    const userId = userRes.rows[0].user_id; // Obtém o 'user_id'
    const userEmail = userRes.rows[0].email; // Armazena o email do usuário

    // Segunda consulta para obter as informações do motorista usando o user_id
    const driverRes = await client.query(
      `SELECT nome, telefone 
       FROM motoristas 
       WHERE user_id = $1`, 
      [userId]
    );

    client.release();

    if (driverRes.rows.length === 0) {
      console.log("Motorista não encontrado.");
      return null; // Retorna null se o motorista não for encontrado
    }

    // Prepara as informações do motorista
    const driverInfo = {
      nome: driverRes.rows[0].nome,
      email: userEmail, // Usa o email do usuário
      telefone: driverRes.rows[0].telefone,
    };

    // Adiciona o console.log para exibir as informações do motorista
    console.log("Informações do motorista:", driverInfo);

    // Retorna as informações do motorista com o email do usuário
    return driverInfo;
  } catch (error) {
    console.error('Erro ao obter informações do motorista:', error.message);
    return null;
  }
}

  

  // Retorna o pool e as funções auxiliares
  return {
    pool,
    getDriverInfoByEmail,
  };
}
