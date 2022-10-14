var venom = require("venom-bot")
const dataHora = require('./dataHora')
var clientEnvio

venom.create({
    session: 'IOT',
    multidevice: true
}).then(function (client){
    clientEnvio = client
    client.onMessage( (message) => {
        clientEnvio = client
        if (message.isGroupMsg === false && message.body != undefined) {
            //console.log(dataHora(),"Mensagem Recebida: ",message.body)
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