var venom = require("venom-bot")
const dataHora = require('./dataHora')
var clientEnvio

venom.create({session: 'IOT_Controller', multidevice: true}).then(function (client){
    clientEnvio = client
    client.onMessage( (message) => {
        clientEnvio = client
        if (message.isGroupMsg === false && message.body != undefined) {
            console.log(dataHora(),"Mensagem Recebida: ",message.body)
            client.sendText(message.from, "Olá, sou um robô usado apenas para envio de Notificações do sistema thomelucas.com.br")
        }
    })
})
.catch((erro) => {
    console.log(dataHora(),"VENOM", erro)
})

module.exports = function alertaZap(cel, msg){
     return new Promise((resolve,reject)=>{
        clientEnvio.sendText(cel, msg).then((result) => {
            //console.log(dataHora(),'MSG Enviada', result.status)
            resolve("OK")
        })
        .catch((erro)=>{
            console.log(dataHora(),`Erro: `, erro.status, " - ", erro.text)
            reject(erro)
        });

     });
 }