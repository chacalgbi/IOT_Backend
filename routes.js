const { Router } = require("express")
const Devices  = require('./controllers/Devices')
const Channels = require('./controllers/Channels')
const Clients  = require('./controllers/Clients')
const routes = new Router()

function testBody(req, res, next){
    console.clear(); // Limpa o terminal sempre que chegar uma requisição (Bom para o desenvolvimento)
    if(Object.keys(req.body).length === 0){
        return res.status(422).json({
            error: true,
            code: 422,
            msg: "Falta um ou mais parâmetros"
        })
    }else{
        return next()
    }
}

function testParams(req, res, next){
    console.clear(); // Limpa o terminal sempre que chegar uma requisição (Bom para o desenvolvimento)
    if(Object.keys(req.params).length === 0){
        return res.status(422).json({
            error: true,
            code: 422,
            msg: "Falta um ou mais parâmetros"
        })
    }else{
        return next()
    }
}

function testAdmin(req, res, next){
    console.clear(); // Limpa o terminal sempre que chegar uma requisição (Bom para o desenvolvimento)
    //console.log(`${req.body.userAdmin} - ${req.body.passAdmin}`)
    if(req.body.userAdmin != process.env.USER_ADMIN){
        return res.status(422).json({
            error: true,
            code: 422,
            msg: "Usuário inválido"
        })
    }else if(req.body.passAdmin != process.env.PASS_ADMIN){
        return res.status(422).json({
            error: true,
            code: 422,
            msg: "Senha inválida"
        })
    }else{
        return next()
    }
}



//Clients CRUD - Somente ADMIN
routes.post  ('/client_list',         testAdmin,             Clients.index)   // Lista todos os Clientes
routes.post  ('/client_insert',       testAdmin, testBody,   Clients.insert)  // Inserir um Cliente
routes.put   ('/client_update',       testAdmin, testBody,   Clients.update)  // Atualiza um Cliente
routes.delete('/client_delete/:id',   testAdmin, testParams, Clients.delete)  // Deleta um Cliente

//Devices CRUD - Somente ADMIN
routes.post  ('/device_list',         testAdmin,             Devices.index)   // Lista todos os Devices
routes.post  ('/device_insert',       testAdmin, testBody,   Devices.insert)  // Inserir um Device
routes.put   ('/device_update',       testAdmin, testBody,   Devices.update)  // Atualiza um Device
routes.delete('/device_delete/:id',   testAdmin, testParams, Devices.delete)  // Deleta um Device

//Channels CRUD - Somente ADMIN
routes.post  ('/channel_list',        testAdmin,             Channels.index)  // Lista todos os Channels
routes.post  ('/channel_insert',      testAdmin, testBody,   Channels.insert) // Inserir um Channel
routes.put   ('/channel_update',      testAdmin, testBody,   Channels.update) // Atualiza um Channel
routes.delete('/channel_delete/:id',  testAdmin, testParams, Channels.delete) // Deleta um Channel



//---------Ações do Device--------------
routes.post('/device_login',   testBody, Devices.login)                         // Fazer login no Device
routes.post('/mqtt_info',      testBody, Devices.mqtt_info)                     // Obtém os dados de mqtt para a placa se conectar
routes.post('/alertaWhatsApp', testAdmin, testBody, Devices.alertaWhatsApp)     // Envia um Alerta pelo WhatsApp
routes.post('/alertaTelegram', testAdmin, testBody, Devices.alertaTelegram)     // Envia um Alerta pelo Telegram
routes.post('/alertaEmail',    testAdmin, testBody, Devices.alertaEmail)        // Envia um Alerta pelo Email

//---------Ações do Cliente--------------
routes.post('/client_login',         testBody, Clients.login)                 // Fazer login na página WEB ou APP
routes.post('/devices_list',         testBody, Devices.list)                  // Pega os Devices por ID do cliente
routes.post('/channels_device_list', testBody, Channels.channels_list)        // Pega os Channels por ID do cliente
routes.post('/clear_log',            testBody, Channels.clear_log)            // Limpa o campo OBS do Channel que passou o ID
routes.post('/prev_state',           testBody, Channels.prev_state)           // Atualiza o campo previous_state para recuperar após fechar e abrir a página
routes.put('/alterar_senha',         testBody, Clients.alterar_senha)         // Alterar senha do cliente



module.exports = routes