// https://github.com/yagop/node-telegram-bot-api/blob/master/examples/polling.js
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TOKEN_BOT
const bot = new TelegramBot(token, { polling: true }) // Cria um bot que usa 'polling' para buscar novas atualizações

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
        resp = "Pronto! Agora é só copiar o código abaixo e inserir nas configurações do seu dispositivo acessando a página web e indo na aba 'Config'."
        setTimeout(() => { bot.sendMessage(chatId, resp, {"reply_markup": {remove_keyboard: true} }) }, 500)
        setTimeout(() => { bot.sendMessage(chatId, `${chatId}`) }, 1500)
    }else if(text === 'não, está errado'){
        resp = "Digite novamente o token do seu dispositivo."
        setTimeout(() => { bot.sendMessage(chatId, resp, {"reply_markup": {remove_keyboard: true} }) }, 100)
    }else if(text === 'cancelar cadastro'){
        resp = "Quando precisar, volte aqui para cadastrar seu SmartPhone para receber notificações."
        setTimeout(() => { bot.sendMessage(chatId, resp, {"reply_markup": {remove_keyboard: true} }) }, 100)
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