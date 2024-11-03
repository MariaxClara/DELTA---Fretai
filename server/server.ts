// Importa o módulo de conexão com o banco de dados
const { Pool } = require('pg');

// Configuração da conexão com o banco de dados
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

// Função para autenticar o usuário
async function loginUser(email, password) {
  try {
    const client = await pool.connect();
    const res = await client.query(
      `SELECT id, nome, email FROM users WHERE email = $1 AND senha = $2`,
      [email, password]
    );
    client.release();
    return res.rows[0];
  } catch (error) {
    console.error('Erro ao logar usuário:', error.message);
    return null;
  }
}

// Função principal para executar o login de teste
// async function main() {
//   const email = 'motorista1@example.com'; // Insira o email para teste
//   const password = 'senhaSegura1'; // Insira a senha para teste

//   const user = await loginUser(email, password);

//   if (user) {
//     console.log('Login bem-sucedido:', user);
//   } else {
//     console.log('Credenciais inválidas');
//   }
// }

// main();
