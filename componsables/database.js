import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',         // Nome de usuário do banco de dados
  host: 'localhost',  // Remover "http://"
  database: 'postgres',     // Nome do banco de dados
  password: '123456',  // Senha do usuário do banco de dados
  port: 5432,               // Porta do PostgreSQL, por padrão 5432
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true, // This will help you. But you will see nwe error
      rejectUnauthorized: false // This line will fix new error
    }
}
});

// Evento para indicar que a conexão foi sucedida
pool.on('connect', () => {
  console.log('Conexão com o banco de dados bem-sucedida!');
});

// Tratamento de erros
pool.on('error', (err) => {
  console.error('Erro na conexão com o banco de dados:', err);
});

// Consulta para listar tabelas no esquema public
pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'", (err, res) => {
  if (err) {
    console.error('Erro ao executar consulta:', err);
  } else {
    console.log('Tabelas no esquema public:', res.rows);
  }
  pool.end(); // Fecha a conexão após a consulta
});
