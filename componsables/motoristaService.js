// Fretai/componsables/motoristaService.js

import { connectDatabase } from './database.js';

export async function getMotoristaInfo(emailProcurado) {
  const pool = connectDatabase(); // Conecta ao banco de dados

  try {
    const query = `
      SELECT u.email, m.nome, m.telefone, m.cpf, m.modelo_veiculo, m.placa_veiculo
      FROM users u
      JOIN motoristas m ON u.user_id = m.user_id
      WHERE u.email = $1;
    `;
    const values = [emailProcurado];
    const res = await pool.query(query, values);

    if (res.rows.length > 0) {
      const { email, nome, telefone, cpf, modelo_veiculo, placa_veiculo } = res.rows[0];

      return {
        emailUsuario: email,
        nomeMotorista: nome,
        telefoneMotorista: telefone,
        cpfMotorista: cpf,
        modeloVeiculo: modelo_veiculo,
        placaVeiculo: placa_veiculo,
      };
    } else {
      throw new Error('Nenhum motorista encontrado para o email fornecido.');
    }
  } catch (error) {
    console.error('Erro ao consultar o banco de dados:', error);
    throw error;
  } finally {
    await pool.end(); // Encerra o pool de conexão
  }
}
