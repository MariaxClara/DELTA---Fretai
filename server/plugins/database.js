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
            p.passageiro_id AS passageiro_id,
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
        passageiro_id: row.passageiro_id,
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

  // Função para buscar o caminho da imagem do usuário
  async function getImagePathByUser(email) {
    try {
      console.log('Buscando caminho da imagem para o email:', email);
      // Passo 1: Buscar o user_id com base no email na tabela users
      const userQuery = 'SELECT user_id FROM users WHERE email = $1';
      const userResult = await pool.query(userQuery, [email]);
  
      if (userResult.rows.length === 0) {
        throw new Error('Usuário não encontrado com o e-mail fornecido');
      }
  
      const userId = userResult.rows[0].user_id;
      console.log('User ID:', userId);
      


      // Passo 2: Buscar o caminho da imagem na tabela user_images com o user_id
      const imageQuery = 'SELECT image_path FROM user_images WHERE user_id = $1';
      const imageResult = await pool.query(imageQuery, [userId]);
  
      if (imageResult.rows.length > 0) {
        return imageResult.rows[0].image_path; // Retorna o caminho da imagem
      } else {
        throw new Error('Imagem não encontrada para o usuário especificado');
      }
    } catch (error) {
      console.error('Erro ao buscar o caminho da imagem:', error.message);
      throw error;
    }
  }

  // Função para buscar informações da corrida (rota) do passageiro com base no e-mail
 // Função para buscar as informações da corrida e do motorista associado ao passageiro
// Função para buscar as informações da corrida e do motorista associado ao passageiro
async function getRaceInfoByEmail(email) {
  try {
    const client = await pool.connect();
    
    // Log para verificar o email recebido
    console.log("Buscando informações da corrida para o email:", email);

    // Primeira consulta: busca informações da corrida e o ID da rota
    const raceRes = await client.query(`
      SELECT 
          p.nome AS passageiro_nome, 
          p.passageiro_id AS passageiro_id,
          p.user_id AS user_id,
          u.email AS passageiro_email, 
          p.telefone AS passageiro_telefone,
          m.nome AS motorista_nome,
          m.telefone AS motorista_telefone,
          r.rota_id,                 -- Obtendo o ID da rota
          r.destino,
          r.horario,
          r.dia_da_semana
      FROM passageiros p
      JOIN users u ON p.user_id = u.user_id
      LEFT JOIN relacionamento_passageiro_rotas rpr ON p.passageiro_id = rpr.passageiro_id
      LEFT JOIN rotas r ON rpr.rotas_id = r.rota_id
      LEFT JOIN motoristas m ON r.motorista_id = m.motorista_id
      WHERE u.email = $1
    `, [email]);

    if (raceRes.rows.length === 0) {
      console.log("Nenhuma corrida encontrada para o passageiro com o email:", email);
      client.release();
      return { error: "Nenhuma corrida encontrada para o passageiro." };  // Retorna um erro se não houver resultados
    }

    // Mapeia as informações de cada corrida encontrada
    const raceInfo = raceRes.rows.map(row => ({
      passageiro_nome: row.passageiro_nome,
      passageiro_id: row.passageiro_id,
      passageiro_email: row.passageiro_email,
      passageiro_telefone: row.passageiro_telefone,
      motorista_nome: row.motorista_nome,
      motorista_telefone: row.motorista_telefone,
      rota_id: row.rota_id,
      destino: row.destino,
      horario: row.horario,
      dia_da_semana: row.dia_da_semana,
      user_id: row.user_id,
      status_corrida: null  // Inicializa com null, a ser preenchido posteriormente
    }));

    // Segunda consulta: busca o status mais recente para cada rota encontrada
    for (let race of raceInfo) {
      const statusRes = await client.query(`
        SELECT 
            status 
        FROM 
            status_viagem 
        WHERE 
            rota_id = $1
        ORDER BY 
            created_at DESC
        LIMIT 1
      `, [race.rota_id]);

      // Verifica se encontrou o status da rota e atualiza o status_corrida
      if (statusRes.rows.length > 0) {
        race.status_corrida = statusRes.rows[0].status;
      } else {
        race.status_corrida = "Status não encontrado";
      }
    }

    client.release();
    
    // Loga as informações da corrida com o status no console
    // /console.log("Informações da corrida com status:", raceInfo);

    // Retorna as informações completas das corridas, incluindo o status
    return raceInfo;

  } catch (error) {
    console.error('Erro ao buscar informações da corrida:', error.message);
    return { error: `Erro ao buscar informações da corrida: ${error.message}` };  // Retorna o erro
  }
}

function changeRaceStatus(rota_id, passageiro_id ,status) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await pool.connect();

      // Insere o novo status na tabela status_viagem
      const query = `
        INSERT INTO log_passageiro_rotas (rota_id, passageiro_id, status) 
        VALUES ($1,$2,$3)
      `;
      await client.query(query, [rota_id,passageiro_id,status]);

      client.release();
      resolve("Status da corrida atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o status da corrida database:", error.message);
      reject(`Erro ao atualizar o status da corrida database: ${error.message}`);
    }
  });
}


  return {
    pool,
    getDriverInfoByEmail,
    getPassengerInfoByEmail,
    getImagePathByUser,
    getRaceInfoByEmail,
    changeRaceStatus,
     // Expondo a função de busca de corrida
  };
}
