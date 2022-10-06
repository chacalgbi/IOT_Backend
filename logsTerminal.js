const API = require('./utils/API')
const log = require('./utils/log')
const timer = require('./utils/dataHora')
const ChannelModel = require('./models/channels')
const mqtt = require('mqtt')
const client = mqtt.connect('wss://narrowbane896:jhUlUA907SSh225C@narrowbane896.cloud.shiftr.io', { clientId: 'Server_Local' })
let ArrayAtivo = []

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

function aviso_placa_offline(topico, msg){
    //console.log(topico, msg)
    ArrayAtivo.map((a) => {
        if (a.topico === topico) {

            if(msg === '1') {
                clearTimeout(a.func)
            } else if(msg === '0') {
                clearTimeout(a.func)
            }

            // Seta de novo o TimeOut, caso a placa fique Offline, essa função dentro vai executar
            a.func = setTimeout(() => {
                const newTopic = topico.replace("ativo", "terminal_OUT")
                const payload = `\n${timer()}Offline`
                //console.log(`----------------------------${newTopic} - ${payload}`)
                client.publish(newTopic, payload)
            }, 30000)

        }
    })
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
        const topico = topic.toString()
        const msg = message.toString()

        //console.log(topico)
        //console.log(msg)

        if(topico.includes("ativo")){
            aviso_placa_offline(topico, msg)
        }else if(topico.includes("terminal_view")){
            channels_list(topico, msg)
        }
    })
}

module.exports = async function logsTerminal() {
    log('Listar Terminais Disponíveis', 'alerta')

    await ChannelModel.findAll()
        .then((res) => {
            let terminais = []
            let ativos = []
            res.map((i) => {
                if (i.type === 'terminal_view' || i.type === 'ativo') {
                    terminais.push(i.path)
                }

                //Guarda no array a lista path ativos
                if(i.type === 'ativo'){
                    ArrayAtivo.push({ topico: i.path, func: null })
                }
            })
            subscrever(terminais)
        })
        .catch((err) => {
            console.error('\x1b[41m', err, '\x1b[0m')
        })
}