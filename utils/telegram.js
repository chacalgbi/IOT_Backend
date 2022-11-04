// https://github.com/yagop/node-telegram-bot-api/blob/master/examples/polling.js
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TOKEN_BOT
const bot = new TelegramBot(token, { polling: true }) // Cria um bot que usa 'polling' para buscar novas atualizações
const DeviceModel = require('../models/devices')

function cadastrarChatId(token, chat_id){
    const arrayToken = token.split(':')
    return new Promise((resolve,reject)=>{
        DeviceModel.update({chat_id: chat_id}, { where: {token: arrayToken[1]}})
        .then((res) => {
            if(res[0] === 1){
                resolve("Seu SmartPhone foi CADASTRADO para receber notificações! Habilite essa função no seu dispositivo")
            }else{
                resolve("Este token não foi encontrado no banco de dados. Consulte seu vendedor para que ele possa cadastrar.")
            }
        })
        .catch((err) => {
            reject("Erro ao cadastrar:", err)
        })

    })
}

function removerChatId(token){
    const arrayToken = token.split(':')
    return new Promise((resolve,reject)=>{
        DeviceModel.update({chat_id: ""}, { where: {token: arrayToken[1]}})
        .then((res) => {
            if(res[0] === 1){
                resolve("Seu SmartPhone foi REMOVIDO e não receberá notificações! Caso queira receber novamente, refaça o cadastro.")
            }else{
                resolve("Este token não foi encontrado no banco de dados. Consulte seu vendedor para que ele possa cadastrar.")
            }
        })
        .catch((err) => {
            reject("Erro ao remover:", err)
        })
    })
}

bot.on('message', async (msg) => {
    const chatId = msg.chat.id
    const text = msg.text.toLowerCase()
    let resp = ''
    //console.log(text)

    if(text === '/start' || text === 'cadastrar'){
        resp = "Olá! Vamos cadastrar seu SmartPhone para receber alertas por aqui? Digite o token do seu produto."
        setTimeout(() => { bot.sendMessage(chatId, resp) }, 500)
    }else if(text.substring(0, 6) === 'monit_'){
        resp = "O Token de seu dispositivo é: " + text + "? Digite SIM para cadastrar seu SmartPhone. Ou se digitou errado digite novamente."
        const opts = {
            reply_to_message_id: msg.message_id,
            reply_markup: JSON.stringify({ keyboard: [ [`SIM:${text}`], ['NÃO, está errado'], ['Cancelar cadastro'] ] })
        }
        setTimeout(() => { bot.sendMessage(chatId, resp, opts) }, 500)
    }else if(text.substring(0, 10) === 'sim:monit_'){
        resp = "Cadastrando seu SmartPhone..."
        setTimeout(() => { bot.sendMessage(chatId, resp, {"reply_markup": {remove_keyboard: true} }) }, 100)
        await cadastrarChatId(text, chatId).then((res) => {
            setTimeout(() => { bot.sendMessage(chatId, res) }, 2000)  
        })
        .catch((err) => {
            setTimeout(() => { bot.sendMessage(chatId, err) }, 2000) 
        })
    }else if(text === 'não, está errado'){
        resp = "Digite novamente o token do seu dispositivo."
        setTimeout(() => { bot.sendMessage(chatId, resp, {"reply_markup": {remove_keyboard: true} }) }, 100)
    }else if(text === 'cancelar cadastro'){
        resp = "Quando precisar, volte aqui para cadastrar seu SmartPhone para receber notificações."
        setTimeout(() => { bot.sendMessage(chatId, resp, {"reply_markup": {remove_keyboard: true} }) }, 100)
    }else if(text.substring(0, 13) === 'delete:monit_'){
        resp = "Removendo seu SmartPhone do cadastro de recebimento de alertas..."
        setTimeout(() => { bot.sendMessage(chatId, resp) }, 100)
        await removerChatId(text).then((res) => {
            setTimeout(() => { bot.sendMessage(chatId, res) }, 2000)
        })
        .catch((err) => {
            setTimeout(() => { bot.sendMessage(chatId, err) }, 2000)
        })
    }

})

module.exports = function alertaTelegram(chat_id, msg) {
    return new Promise((resolve, reject) => {
        bot.sendMessage(chat_id, msg).then((res) => {
            resolve(`${res.chat.first_name} recebeu`)
        })
        .catch((err) => {
            reject(err.message)
        })
    })
}