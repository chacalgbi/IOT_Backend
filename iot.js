require('dotenv').config()
let globalConf = require('./utils/globalConf')
const express = require("express")
const routes = require('./routes')
const cors = require('cors')
const log   = require('./utils/log')
const database = require('./dataBase')
const {RateLimiterMemory} = require('rate-limiter-flexible')
const logsTerminal = require('./logsTerminal')
const email = require('./utils/email')
const alertaZap = require('./utils/whatsApp')
var cron = require('node-cron')
const app = express()
const limiter = new RateLimiterMemory({ points: 10, duration: 5 })

async function alertaMail(msg) {
	await email("chacalgbi@hotmail.com", "LIMITE DE REQUISIÇÃO NO SERVIDOR", msg)
		.then((resp) => { log(`Requisições Exedidas - EMAIL ENVIADO`, 'alerta') })
		.catch((err) => { console.log("ERRO ALERTA REQUISIÇÕES EMAIL", err) })
}

async function enviar_msg_zap() {
	await alertaZap("557788188514@c.us", "VENOM funcionando hoje! Versão: 5.0.16")
	.then((res) => {

	})
	.catch((err) => {
		console.log(err)
	})
}

async function testBD(){
	let isConected = false

    await database.authenticate()
	.then((res)=>{
		isConected = true
    	log('Conexão com o Banco de dados estabelecida com sucesso!', 'info')
			
    })
    .catch((erro)=>{
    	console.error('Erro ao conectar no Banco de dados:', erro)
    })

	if(isConected){
		const Clients = require('./models/clients')
		const Devices = require('./models/devices')
		const Channels = require('./models/channels')

		await database.sync()
		.then((res)=>{
			log('Tabelas sincronizadas!', 'info')
			cron.schedule('*/1 * * * *', () => { globalConf.bloq = false }) // Rodando a TASK a cada 1 minuto.
		})
		.catch((erro)=>{
			console.error('Erro ao sincronizar tabelas!', error)
		})

		cron.schedule('30 7 * * *', () => {
			log('ENVIA MENSAGEM PELO ZAP TODO DIA.')
			enviar_msg_zap()
		})

	}
}

app.use((req, res, next)=> {
	limiter.consume(req.ip)
		.then((resp) => { return next() })
		.catch((err) => {
			const msg = `ENVIANDO EMAIL - Requisições Exedidas: ${req.ip} - REqs:${err.consumedPoints} - proxReqEm: ${err.msBeforeNext} millis`
			if(err.consumedPoints > 50 && globalConf.bloq == false){
				log(msg, 'erro')
				globalConf.bloq = true
				alertaMail(msg)
			}
			return res.status(429).json({
				message: 'Muitas requisições! Isso não se faz.',
				ip: req.ip,
				//proxRequisicaoEm: `${err.msBeforeNext} millis`,
				//requests: err.consumedPoints
			})
		})
 })

app.use(cors())
app.use(express.json())
app.use(routes)
//app.use(express.static(__dirname + '/assets'))
app.get('/',  (req, res, next)=>{res.status(200).json({message: 'Nada aqui para ver...'})})
app.post('/', (req, res, next)=>{res.status(200).json({message: 'Nada aqui para ver...'})})
app.use((req, res, next)=> { res.status(404).json({message: 'Esta rota não existe'})}) //Caso acesse alguma rota que não existe

app.listen(process.env.API_PORT, () => {
    log(`API - IOT Devices - Porta: ${process.env.API_PORT}`, 'temp')
		logsTerminal()
		setTimeout(()=>{ testBD() }, 5000)
})