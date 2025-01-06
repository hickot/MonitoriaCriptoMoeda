const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: '10301030',
  database: 'bd_cotacaocripto',
  port: 5432, // Porta padrão do PostgreSQL
});

client.connect()
  .then(() => console.log('Conectado ao banco de dados PostgreSQL'))
  .catch(err => console.error('Erro ao conectar ao banco de dados:', err));

module.exports = client;
