// server/db/database.ts
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

interface User {
  user_id: number;
  email: string;
  senha: string;
}

async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    const client = await pool.connect();
    const res = await client.query(
      `SELECT user_id, email, senha FROM users WHERE email = $1 AND senha = $2`,
      [email, password]
    );
    client.release();
    return res.rows[0] || null;
  } catch (error: any) {
    console.error('Erro ao logar usuário:', error.message);
    return null;
  }
}

async function getTables(): Promise<{ table_name: string }[] | null> {
  try {
    const client = await pool.connect();
    const res = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
    client.release();
    return res.rows;
  } catch (error: any) {
    console.error('Erro ao obter tabelas:', error.message);
    return null;
  }
}


async function updatePassword(email: string, newPassword: string): Promise<User | null> {
  console.log("BDDD");
  const client = await pool.connect();
  try {
    // Atualiza a senha do usuário no banco de dados e retorna os dados do usuário
    const res = await client.query(
      `UPDATE users SET senha = $1 WHERE email = $2 RETURNING user_id, email, senha`,
      [newPassword, email]
    );
    console.log("fazendo consulta")


    // Verifica se o usuário foi encontrado e a senha foi atualizada
    if (res.rowCount === 0) {
      console.log("Naom achou")
      return null; // Usuário não encontrado
    }

    // Retorna o usuário atualizado, ocultando a senha para segurança
    const { user_id: id, email: userEmail } = res.rows[0];
    return { user_id: id, email: userEmail, senha: '' };

  } catch (error) {
    const err = error as Error;
    console.error('Erro ao atualizar a senha:', err.message);
    return null;
  } finally {
    client.release();
  }
}




export { pool, loginUser, updatePassword, getTables };

