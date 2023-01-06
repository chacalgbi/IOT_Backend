require('dotenv').config()
const app = require('./app')
const log   = require('./utils/log')
const database = require('./dataBase')
const logsTerminal = require('./logsTerminal')
var cron = require('node-cron')

async function testBD(){
	let isConected = false

    await database.authenticate()
	.then((res)=>{
		isConected = true
    	log('Conexão com o Banco de dados estabelecida com sucesso!', 'info')
    })
    .catch((erro)=>{
    	console.error('Erro ao conectar no Banco de dados:', error)
    })

	if(isConected){
		const Clients = require('./models/clients')
		const Devices = require('./models/devices')
		const Channels = require('./models/channels')

		await database.sync()
		.then((res)=>{
			log('Tabelas sincronizadas!', 'info')
			logsTerminal()
			//cron.schedule('3 * * * *', () => {
			//	log('Rodando a TASK a cada 20 minutos');
			//	logsTerminal()
			//  });
		})
		.catch((erro)=>{
			console.error('Erro ao sincronizar tabelas!', error)
		})

	}
}

app.get('/',  (req, res, next)=>{res.status(200).json({message: 'Nada aqui para ver...'})})
app.post('/', (req, res, next)=>{res.status(200).json({message: 'Nada aqui para ver...'})})

//Caso acesse alguma rota que não existe
app.use((req, res, next)=> { res.status(404).json({message: 'Esta rota não existe'})})

app.listen(process.env.API_PORT, () => {
    log(`API - IOT Devices - Porta: ${process.env.API_PORT}`, 'alerta');
    testBD();
})