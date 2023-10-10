require('dotenv').config()
const API = require('./utils/API')
const log = require('./utils/log')
const timer = require('./utils/dataHora')
const topicos = require('./utils/topicos')
const ChannelModel = require('./models/channels')
const mqtt = require('mqtt')
let ArrayAtivo = []

//shiftr.io
//const client = mqtt.connect('wss://narrowbane896:jhUlUA907SSh225C@narrowbane896.cloud.shiftr.io', { clientId: 'Server' })

// Mosquitto VPS 2GB
const options = {
    port: process.env.MQTT_PORT,
    clientId: 'Server1',
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS,
    clean:true
}
const client = mqtt.connect(process.env.MQTT_HOST, options)

function limitarString(str, limit){
    str = str.substring(str.length - limit)
    return str
}

async function channels_list(topic, message) {

    let sucesso = false
    let ChannelChange
    await ChannelModel.findAll({ where: { path: topic } })
        .then((res) => {
            if(res.length === 0){
                log("Channel inválido!", 'erro')
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
            ChannelChange.obs = limitarString(ChannelChange.obs, 800) // Limita sempre aos ultimos 800 caracteres

            await ChannelChange.save()
                .then((res) => {
                })
                .catch((err) => {
                    log("ERRO ao atualizar o Channel", 'erro')
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
                log(`${topico} - Offline`, 'erro')
                client.publish(newTopic, payload)
            }, 60000)

        }
    })
}

function subscrever(terminais) {
    log('Conectando MQTT...', 'info')

    client.on('connect', function () {
        log('MQTT Conectado!', 'info')

        client.subscribe(terminais, function (err) {
            if (!err) {
                log(`Subscrito em ${terminais.length} tópicos`, 'alerta')
                log('NÃO ESQUEÇER DE ATUALIZAR O ARRAY A CADA NOVO DEVICE CADASTRADO.', 'erro')
                //console.log(terminais)
            }else{
                console.log("Subscrible Erros: ", err)
            }
        })
    })

    client.on('error', function(err) {
        console.log('MQTT ERROR:', err)
    })

    client.on('message', function (topic, message) {
        const topico = topic.toString()
        const msg = message.toString()
        
        if(topico.includes("ativo")){
            aviso_placa_offline(topico, msg)
        }else if(topico.includes("terminal_OUT")){
            channels_list(topico, msg)
        }
    })
}

module.exports = function logsTerminal() {
    let terminais = []

    topicos.map((i) => {
        terminais.push(i.path)
        if (i.type === 'ativo') {
            const newTopic = i.path.replace("ativo", "terminal_OUT")
            terminais.push(newTopic)
            ArrayAtivo.push({ topico: i.path, func: null })
        }
    })

    subscrever(terminais)
}