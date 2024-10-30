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

  // Função auxiliar para obter as tabelas do banco de dados
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

  // Retorna o pool e as funções auxiliares para uso em outros arquivos
  return {
    pool,
    getTables,
  };
}
