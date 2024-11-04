// database.ts
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
      `SELECT user_id, email, senha, primeiro_login FROM users WHERE email = $1 AND senha = $2`,
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
    const res = await client.query(
      `UPDATE users SET senha = $1 WHERE email = $2 RETURNING user_id, email, senha`,
      [newPassword, email]
    );
    console.log("fazendo consulta")

    if (res.rowCount === 0) {
      console.log("Naom achou")
      return null;
    }

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

type UserRole = "motorista" | "passageiro" | "desconhecido" | null;

async function getUserType(user_id: number): Promise<UserRole> {
  const client = await pool.connect();
  try {
    // First check passageiros table
    const passengerRes = await client.query(
      'SELECT 1 FROM passageiros WHERE user_id = $1',
      [user_id]
    );
    
    if (passengerRes.rowCount > 0) {
      return "passageiro";
    }
    
    // Then check motoristas table
    const driverRes = await client.query(
      'SELECT 1 FROM motoristas WHERE user_id = $1',
      [user_id]
    );
    
    if (driverRes.rowCount > 0) {
      return "motorista";
    }
    
    return "desconhecido";
  } catch (error) {
    console.error("Erro ao verificar tipo de usuário:", error);
    return "desconhecido";
  } finally {
    client.release();
  }
}

// Keep the original usertype function as it might be used elsewhere
async function usertype(user_id: number): Promise<UserRole> {
  console.log('função tipo usuario')
  return null; 
}

export { pool, loginUser, updatePassword, getTables, getUserType, usertype };