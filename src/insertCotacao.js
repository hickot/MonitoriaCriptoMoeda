const client = require('./db');

// Acessa os parâmetros passados pelo script principal
const params = process.argv.slice(2);



console.log('Parâmetros recebidos:', params);

// Função para inserir um novo registro
const insertRecord = async (datahora, time, cotacao, diferenca, datetime) => {
  const query = 'INSERT INTO tbl_bitcoin (datahora, time, cotacao, diferenca, datetime) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const values = [datahora, time, cotacao, diferenca, datetime];

  try {
    const res = await client.query(query, values);
    console.log('Registro inserido:', res.rows[0]);
  } catch (err) {
    console.error('Erro ao inserir registro:', err);
  } finally {
    await client.end();
    console.log('Conexão fechada');
  }
};

let datahora = params[0];
let time = params[1];
let cotacao = params[2];
let diferenca = params[3];
let datetime = params[4];

// Chamar a função de inserção
insertRecord(datahora, time, cotacao, diferenca, datetime);