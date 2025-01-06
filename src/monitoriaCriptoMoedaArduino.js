const SerialPort = require("serialport");
const https = require('https');
const Readline = SerialPort.parsers.Readline;

 //const port = new SerialPort("COM3", {
// const port = new SerialPort("/dev/cu.usbmodem11201", {
//   baudRate: 9600,
// });

// const port = new SerialPort("/dev/cu.usbmodem101", {
//   baudRate: 9600,
// });

const port = new SerialPort("/dev/cu.usbmodem1201", {
  baudRate: 9600,
});

const parser = new Readline();
const si = require("systeminformation");

port.pipe(parser);
parser.on("data", console.log);



var operacao = "vender";
var texto1 = "";
var texto2 = "";
var amount = 14049.20;
var side = "sell";
var price = 0;
var base_currency = "btc";
var cotaComprada = 0.02199665;
let str = "";

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
    console.log("Cotação: R$ " + formatador.format(price));

    texto1 = "";
    texto2 = "";
    str = "";

    //Cotação
    texto1 = "R$ " + formatador.format(price);
    
    if (operacao == "vender") {

      //var multiplicacao = price * cotaComprada;      
      var diferenca = price * cotaComprada - amount;

      if (diferenca > 0) {
        console.warn("Lucro: R$ " + formatador.format(diferenca));

        //Diferença
        texto2 = "R$ " + formatador.format(diferenca);
      } else {
        console.warn("Prejuízo: R$ " + formatador.format(diferenca));''

        //Diferença
        texto2 = "R$ " + formatador.format(diferenca);
      }
      console.log("");
    } 
  } catch (error) {
    console.error('Erro na requisição:', error.message);
  } finally {
    return "Doug " + texto1 + " | " + texto2;
  }
}





const getCPUData = async () => {
    try {
      return await parseInt(
        await si.currentLoad().then((data) => {
          return data.currentLoad;
        })
      );
    } catch (error) {
      return Promise.reject("Oops!").catch((err) => {
        throw new Error(err);
      });
    }
};

const stringFactory = () => {
    port.on("data", async (data) => {
      let mensagem = await sendRequestWithHeaders();
      let cpuUsage = await getCPUData();
      // let memUsage = await getMemoryData();
      // let bateryPercent = await getBateryData();
  
      str =
        `${texto1} ` +
        `  ${texto2} `;
  
      if (cpuUsage) {
        console.log("Tela: "+ str);// + "Velocidade: ");
        port.write(str);
      }
    });
};
  
port.on("open", () => {
    stringFactory();
});