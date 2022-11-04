const API = require('./utils/API')
const log = require('./utils/log')
const timer = require('./utils/dataHora')
const ChannelModel = require('./models/channels')
const mqtt = require('mqtt')
const client = mqtt.connect('wss://narrowbane896:jhUlUA907SSh225C@narrowbane896.cloud.shiftr.io', { clientId: 'Server' })
let ArrayAtivo = []

async function channels_list(topic, message) {
    log(`----3 - Procura Terminal ${topic}`, 'info')

    let sucesso = false
    let ChannelChange
    await ChannelModel.findAll({ where: { path: topic } })
        .then((res) => {
            if(res.length === 0){
                log("----4 - Channel inválido!", 'erro')
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
                    log("----4 - Sucesso ao atualizar o Channel", 'info')
                })
                .catch((err) => {
                    log("----4 - ERRO ao atualizar o Channel", 'erro')
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
                const dateFormated = timer().replace(/\//g, '\\').split(':')
                const payload = `${dateFormated[0]}:${dateFormated[1]} OffLine`
                log(`----1 - ${topico} - Offline`, 'erro')
                client.publish(newTopic, payload)
            }, 30000)

        }
    })
}

function subscrever(terminais) {
    //client.end()

    client.on('connect', function () {
        client.subscribe(terminais, function (err) {
            if (!err) {
                log("Subscrible feito com Sucesso!", 'info')
                log('Lista de Inscrições feitas', 'alerta')
                console.log(terminais)
            }else{
                console.log("Subscrible Erros: ", err)
            }
        })
    })


    client.on('message', function (topic, message) {
        const topico = topic.toString()
        const msg = message.toString()

        
        if(topico.includes("ativo")){
            aviso_placa_offline(topico, msg)
        }else if(topico.includes("terminal_OUT")){
            console.log(" ")
            log(`----2 - Recebendo dados: ${topico}`, 'alerta')
            channels_list(topico, msg)
        }
    })
}

module.exports = async function logsTerminal() {
    log('Listar Terminais Disponíveis', 'info')

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
                    //ArrayAtivo = [];
                    ArrayAtivo.push({ topico: i.path, func: null })
                }
            })
            subscrever(terminais)
        })
        .catch((err) => {
            console.error('\x1b[41m', err, '\x1b[0m')
        })
}