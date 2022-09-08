const API = require('./utils/API')
const log = require('./utils/log')
const ChannelModel = require('./models/channels')
const mqtt = require('mqtt')
const client = mqtt.connect('wss://narrowbane896:jhUlUA907SSh225C@narrowbane896.cloud.shiftr.io', { clientId: 'Server' })


async function channels_list(topic, message) {
    log(`Procura Terminal ${topic}`, 'info')

    let sucesso = false
    let ChannelChange
    await ChannelModel.findAll({ where: { path: topic } })
        .then((res) => {
            if(res.length === 0){
                console.log("Channel inválido!")
            }else{
                ChannelChange = res[0]
                sucesso = true
            }
        })
        .catch((err) => {
            console.error('\x1b[41m', err, '\x1b[0m')
        })
        //console.log(ChannelChange)

        if(sucesso){
            ChannelChange.obs = ChannelChange.obs + "\n" + message

            await ChannelChange.save()
                .then((res) => {
                    console.log("Sucesso ao atualizar o Channel")
                })
                .catch((err) => {
                    console.log("ERRO ao atualizar o Channel")
                    console.error(err)
                })            
        }

}

function subscrever(terminais) {
    //client.end()
    client.on('connect', function () {

    })

    client.subscribe(terminais, function (err) {
        if (!err) {
            log("Subscrible feito com Sucesso!", 'temp')
        }else{
            console.log("Subscrible Erros: ", err)
        }
    })

    client.on('message', function (topic, message) {
        console.log(topic.toString())
        //console.log(message.toString())
        channels_list(topic.toString(), message.toString())
    })
}

module.exports = async function logsTerminal() {
    log('Listar Terminais Disponíveis', 'alerta')

    await ChannelModel.findAll()
        .then((res) => {
            let terminais = []
            res.map((i) => {
                if (i.type === 'terminal_view') {
                    terminais.push(i.path)
                }
            })
            subscrever(terminais)
        })
        .catch((err) => {
            console.error('\x1b[41m', err, '\x1b[0m')
        })
}