const venom = require('venom-bot');

//Variável para envio de e-mail
var enviouEmail = false;
//var enviouWhatsApp = false;

//Define a mensagem a ser enviada pelo WhatsApp
var mensagemWhatsApp = "";

var operacao = "vender";

//Get a market quotation

// Executar o código inicialmente
sendRequestWithHeaders();

// Executar o código a cada 5 minutos
setInterval(sendRequestWithHeaders, 600000);

var amount = 14049.20;
var side = "sell";
var price = 0;
var base_currency = "btc";
var cotaComprada = 0.02199665;

const axios = require('axios');
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
    
    if (operacao == "vender") {

      var multiplicacao = price * cotaComprada;
      console.log("Valor final: R$ " + multiplicacao.toLocaleString("pt-BR"));
      var diferenca = price * cotaComprada - amount;

      if (diferenca > 0) {
        console.warn("Lucro: R$ " + formatador.format(diferenca));
      } else {
        console.warn("Prejuízo: R$ " + formatador.format(diferenca));
      }
      console.log("");
    } 

    if (operacao == "vender") {

      if (price > 713800) {
        console.log("É hora de vender!");
        mensagemWhatsApp = 'A cotação da moeda ' + base_currency + ' está em R$ '+ formatador.format(price) +', dessa forma é hora de vender, com lucro de R$ ' + formatador.format(diferenca);
        sendWhatsApp(mensagemWhatsApp);
        
      } else {
  
        if (diferenca > 0) {
          mensagemWhatsApp = '_*Cotação*_: R$ ' + formatador.format(price)
        + '         '+' _*Lucro*_: R$ ' + formatador.format(diferenca);
        sendWhatsApp(mensagemWhatsApp);
        } else {
          mensagemWhatsApp = '_*Cotação*_: R$ ' + formatador.format(price)
        + '         '+' _*Prejuízo*_: R$ ' + formatador.format(diferenca);
        sendWhatsApp(mensagemWhatsApp);
        }     
      }
    } else {

      if (price < 625000) {
        console.log("É hora de comprar Bitcoin!");
        mensagemWhatsApp = 'A cotação da moeda ' + base_currency + ' está em R$ '+ formatador.format(price) +', dessa forma é hora de comprar!';
        sendWhatsApp(mensagemWhatsApp);
        
      } else {
  
        
          mensagemWhatsApp = '_*Cotação*_: R$ ' + formatador.format(price)
        sendWhatsApp(mensagemWhatsApp);
        }   
      }
    
  } catch (error) {
    console.error('Erro na requisição:', error.message);
  }
}

function sendWhatsApp (mensagemWhatsApp) {

  venom.create({
    session: 'alertaWhatsApp', // Defina um nome para a sessão
    //folderNameToken: 'tokens', // Opcional: pasta onde os tokens serão armazenados
  }).then((client) => {
    client.sendText('5521984263016@c.us', mensagemWhatsApp).
      then((result) => {
    console.log('Mensagem enviada com sucesso:', result);
    client.close(1);
    }).catch((erro) => {
      console.error('Erro ao enviar mensagem:', erro);
    });
  }).catch((erro) => {
    console.error('Erro ao iniciar Venom Bot:', erro);
  });
}

sendRequestWithHeaders();