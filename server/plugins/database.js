// server/plugins/database.js
import pkg from 'pg';
const { Pool } = pkg;

export default function () {
  const pool = new Pool({
    user: 'postgres',
    host: 'fretai-dev.cd608okioi2v.sa-east-1.rds.amazonaws.com',
    database: 'postgres',
    password: 'RvDhpqjy5g0uYTj454Do',
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
        return null;
      }

      const userId = userRes.rows[0].user_id;
      const userEmail = userRes.rows[0].email;

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
        return null;
      }

      const driverInfo = {
        nome: driverRes.rows[0].nome,
        email: userEmail,
        telefone: driverRes.rows[0].telefone,
      };

      console.log("Informações do motorista:", driverInfo);
      return driverInfo;
    } catch (error) {
      console.error('Erro ao obter informações do motorista:', error.message);
      return null;
    }
  }

  // Função para buscar informações do passageiro e do motorista relacionado
  async function getPassengerInfoByEmail(email) {
    try {
      const client = await pool.connect();
  
      const res = await client.query(`
        SELECT 
            p.nome AS passageiro_nome, 
            u.email AS passageiro_email, 
            p.telefone AS passageiro_telefone,
            m.nome AS motorista_nome,
            m.telefone AS motorista_telefone
        FROM passageiros p
        JOIN users u ON p.user_id = u.user_id
        LEFT JOIN relacionamento_passageiro_rotas rpr ON p.passageiro_id = rpr.passageiro_id
        LEFT JOIN rotas r ON rpr.rotas_id = r.rota_id
        LEFT JOIN motoristas m ON r.motorista_id = m.motorista_id
        WHERE u.email = $1
      `, [email]);
  
      client.release();
  
      console.log("Resultado da consulta:", res.rows); // Adicionando log
  
      if (res.rows.length === 0) {
        return null; // Nenhum passageiro encontrado
      }
  
      // Retorna apenas as informações necessárias
      const passengerInfo = res.rows.map(row => ({
        passageiro_nome: row.passageiro_nome,
        passageiro_email: row.passageiro_email,
        passageiro_telefone: row.passageiro_telefone,
        motorista_nome: row.motorista_nome,
        motorista_telefone: row.motorista_telefone,
      }));

      return passengerInfo; // Retorna as informações do passageiro e do motorista
    } catch (error) {
      console.error('Erro ao obter informações do passageiro:', error.message);
      return null;
    }
  }

  return {
    pool,
    getDriverInfoByEmail,
    getPassengerInfoByEmail,
  };
}
