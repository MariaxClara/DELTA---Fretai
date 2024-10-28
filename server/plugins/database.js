// database.js
import pkg from 'pg';
const { Pool } = pkg;

export default async function connectDatabase() {
  const pool = new Pool({
    user: 'postgres',
    host: '',
    database: 'postgres',
    password: '',
    port: 5432,
    ssl: {
      rejectUnauthorized: false, // Ignora a verificação do certificado
    }
  });

  try {
    const client = await pool.connect();
    console.log('Conexão com o banco de dados bem-sucedida!');
    client.release(); // Liberar o cliente de volta para o pool
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
  }
}
