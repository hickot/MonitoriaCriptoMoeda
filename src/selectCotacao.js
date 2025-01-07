const client = require('./db');

const query = 'select cotacao, diferenca from tbl_bitcoin ORDER BY id DESC limit 1;'; // Substitua "sua_tabela" pelo nome da tabela que deseja consultar.

client.query(query)
  .then(res => {
    console.log('Resultados:', res.rows); // Exibe os dados retornados
  })
  .catch(err => {
    console.error('Erro ao executar query:', err.stack);
  })
  .finally(() => {
    client.end(); // Fecha a conexão
  });