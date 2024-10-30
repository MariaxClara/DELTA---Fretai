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

  async function getTables() {
    try {
      const client = await pool.connect();
      const res = await client.query(`
        SELECT table_name 
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `);
      client.release();
      return res.rows.map(row => row.table_name);
    } catch (error) {
      console.error('Erro ao obter tabelas:', error.message);
      return [];
    }
  }

  async function updatePassword(userId, newPassword) {
    try {
      const client = await pool.connect();
      const res = await client.query(
        `UPDATE users SET senha = $1, primeiro_login = FALSE WHERE id = $2`,
        [newPassword, userId]
      );
      client.release();
      return res.rowCount > 0;
    } catch (error) {
      console.error('Erro ao atualizar senha:', error.message);
      return false;
    }
  }

  return {
    pool,
    getTables,
  };
}
