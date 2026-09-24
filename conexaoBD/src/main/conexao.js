const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const mysql = require('mysql2');

const caminhoEnv = path.resolve(__dirname, '../../.env');
const caminhoEnvAlternativo = path.resolve(__dirname, '../../.env.example.env');

dotenv.config({
  path: fs.existsSync(caminhoEnv) ? caminhoEnv : caminhoEnvAlternativo,
  override: true,
  quiet: true
});

const configuracaoObrigatoria = ['DB_HOST', 'DB_USER', 'DB_NAME'];
const configuracaoAusente = configuracaoObrigatoria.filter((chave) => !process.env[chave]);
const porta = Number(process.env.DB_PORT || 3306);

if (configuracaoAusente.length > 0) {
  throw new Error(`Configuração do banco ausente: ${configuracaoAusente.join(', ')}. Crie o arquivo .env com base no .env.example.`);
}

if (!Number.isInteger(porta) || porta < 1 || porta > 65535) {
  throw new Error('DB_PORT deve ser um número inteiro entre 1 e 65535. Para MySQL, normalmente use 3306.');
}

const conexao = mysql.createPool({
  host: process.env.DB_HOST,
  port: porta,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

module.exports = conexao;