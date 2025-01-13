const { spawn } = require('child_process');

// Executar o código inicialmente
sendRequestWithHeaders();

// Executar o código a cada 5 segundos
setInterval(sendRequestWithHeaders, 5000);

var amount = 14049.20;
var side = "sell";
var price = 0;
var base_currency = "btc";
var cotaComprada = 0.02199665;

const axios = require('axios');
const { time, timeStamp } = require('console');
//const nodemailer = require('nodemailer');

const formatador = new Intl.NumberFormat("pt-BR", {
  style: "decimal", // Apenas números (sem moeda)
  minimumFractionDigits: 2, // Número mínimo de casas decimais
  maximumFractionDigits: 2, // Número máximo de casas decimais
});

async function sendRequestWithHeaders() {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    const config = {
      headers: headers
    };

    const response = await axios.get('https://api.foxbit.com.br/rest/v3/markets/quotes?side=' + side + '&base_currency=' + base_currency + '&quote_currency=brl&amount=' + amount, config);
    const responseObjString = JSON.stringify(response.data);
    //console.log("Response: "+responseObjString);
    price = response.data['price'];
    console.log("Cotação do Bitcoin: R$ " + formatador.format(price));

    var multiplicacao = price * cotaComprada;
    console.log("Valor final: R$ " + multiplicacao.toLocaleString("pt-BR"));
    var diferenca = price * cotaComprada - amount;

    if (diferenca > 0) {
    console.warn("Lucro: R$ " + formatador.format(diferenca));
    } else {
    console.warn("Prejuízo: R$ " + formatador.format(diferenca));
    }
    console.log("");

    const moment = require('moment-timezone');

    // Define o fuso horário
    const timezone = 'America/Sao_Paulo';

    // Pega a data e hora atual no fuso horário especificado
    const dataAtual = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    const time = dataAtual;
    
    //Timezone Africa/Abidjan para a coluna datahora
    const timezoneDataHora = 'Africa/Abidjan';
    const dataAtualDataHora = moment().tz(timezoneDataHora).format('YYYY-MM-DD HH:mm:ss');
    const date= dataAtualDataHora;
    const dataLocalString = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    
    //Prepara a constante params
    const params = [dataLocalString, time, price, diferenca, date];    
   
    // Inicia o script filho
    const insertCotacao = spawn('node', ['insertCotacao.js', ...params]);

    // Captura a saída do script filho
    insertCotacao.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    insertCotacao.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    insertCotacao.on('close', (code) => {
        console.log(`insertCotacao process exited with code ${code}`);
    });

  } catch (error) {
    console.error('Erro na requisição:', error.message);
  }
}

sendRequestWithHeaders();