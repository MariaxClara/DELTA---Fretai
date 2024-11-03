// server/db/database.js
import pkg from 'pg';
const { Pool } = pkg;

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

async function loginUser(email, password) {
  try {
    const client = await pool.connect();
    const res = await client.query(
      `SELECT user_id, email, senha FROM users WHERE email = $1 AND senha = $2`,
      [email, password]
    );
    client.release();
    return res.rows[0];
  } catch (error) {
    console.error('Erro ao logar usuário:', error.message);
    return null;
  }
}

// Nova função para obter as tabelas do banco de dados
async function getTables() {
  try {
    const client = await pool.connect();
    const res = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
    client.release();
    return res.rows;
  } catch (error) {
    console.error('Erro ao obter tabelas:', error.message);
    return null;
  }
}

export { pool, loginUser, getTables };
