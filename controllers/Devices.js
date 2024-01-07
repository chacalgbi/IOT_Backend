const API = require('../utils/API')
const log = require('../utils/log')
const DeviceModel = require('../models/devices')
const ClientModel = require('../models/clients')
//const alertaZap = require('../utils/whatsApp')
//const alertaTelegram = require('../utils/telegram')
const alertaMail = require('../utils/email')
let status = 0

String.prototype.replaceAt = function (index, replacement) {
    if (index >= this.length) {
        return this.valueOf()
    }
  
    var chars = this.split('')
    chars[index] = replacement
    return chars.join('')
  }

class Device {

    // Lista todos os Devices
    async index(req, res) {
        log('Listar Devices', 'info')
        let isSucess = false
        let retorno = {}

        await DeviceModel.findAll()
            .then((res) => {
                status = 200
                isSucess = true
                retorno.msg = "Sucesso ao listar os Devices"
                retorno.dados = res
            })
            .catch((err) => {
                status = 500
                retorno.msg = "ERRO ao listar os Devices"
                retorno.dados = err
                console.error('\x1b[41m', err, '\x1b[0m')
            })

        API(retorno, res, status, isSucess)
    }

    // Inserir um Device
    async insert(req, res) {
        log('Criar Device', 'info')
        let isSucess = false
        let retorno = {}

        await DeviceModel.create({
            client_id: req.body.client_id,
            description: req.body.description,
            device: req.body.device,
            token: req.body.token,
            tipo: req.body.tipo,
            versao: req.body.versao,
            linkAjuda: req.body.ajuda,
            pathUpdate: req.body.pathUpdate,
            obs: req.body.obs,
        })
            .then((res) => {
                status = 200
                isSucess = true
                retorno.msg = "Device cadastrado com sucesso!"
                retorno.dados = res
            })
            .catch((err) => {
                status = 500
                retorno.msg = "ERRO ao cadastrar Device"
                retorno.dados = err
                console.error('\x1b[41m', err, '\x1b[0m')
            })

        API(retorno, res, status, isSucess);
    }

    // Atualiza um Device
    async update(req, res) {
        log('Editar Device', 'info')
        let isSucess = false
        let retorno = {}
        let DeviceChange

        await DeviceModel.findByPk(req.body.id)
            .then((res) => {
                if (res === null) {
                    status = 404
                    isSucess = false
                    retorno.msg = "Device não encontrado!"
                } else {
                    isSucess = true
                    DeviceChange = res
                }
            })
            .catch((err) => {
                status = 500
                retorno.msg = "ERRO ao buscar ID do Device"
                retorno.dados = err
                console.error('\x1b[41m', err, '\x1b[0m')
            })

        if (isSucess) {
            DeviceChange.client_id = req.body.client_id
            DeviceChange.description = req.body.description
            DeviceChange.device = req.body.device
            DeviceChange.token = req.body.token
            DeviceChange.tipo = req.body.tipo
            DeviceChange.versao = req.body.versao
            DeviceChange.linkAjuda = req.body.ajuda
            DeviceChange.pathUpdate = req.body.pathUpdate
            DeviceChange.obs = req.body.obs

            await DeviceChange.save()
                .then((res) => {
                    isSucess = true
                    retorno.dados = res
                    retorno.msg = "Sucesso ao atualizar o Device"
                })
                .catch((err) => {
                    status = 500
                    isSucess = false
                    retorno.msg = "ERRO ao atualizar o Device"
                    retorno.dados = err
                    console.error(err);
                })
        }

        API(retorno, res, status, isSucess);
    }

    // Deleta um Device
    async delete(req, res) {
        log('Deletar Device', 'info')
        let isSucess = false
        let retorno = {}

        await DeviceModel.destroy({ where: { id: req.params.id } })
            .then((res) => {
                if (res === 0) {
                    status = 404
                    retorno.msg = "Erro ao apagar. Id do Device não foi encontrado"
                    retorno.dados = res
                    isSucess = false
                } else {
                    status = 200
                    retorno.msg = "Sucesso ao deletar o Device"
                    retorno.dados = res
                    isSucess = true
                }
            })
            .catch((err) => {
                status = 500
                retorno.msg = "ERRO ao deletar o Device"
                retorno.dados = err
                console.error('\x1b[41m', err, '\x1b[0m')
            })

        API(retorno, res, status, isSucess)
    }

    // Fazer login no Device
    async login(req, res) {
        log(`Logando Device`, 'info')
        let isSucess = false
        let retorno = {}

        await DeviceModel.findAll({ where: { token: req.body.token } })
            .then((res) => {
                if (res.length === 0) {
                    status = 403
                    isSucess = false
                    retorno.msg = "Token inválido!"
                } else {
                    status = 200
                    isSucess = true
                    retorno.msg = "Acesso liberado!"
                }
                retorno.dados = res
            })
            .catch((err) => {
                status = 500
                retorno.msg = "ERRO ao fazer o login do Device."
                retorno.dados = err
                console.error('\x1b[41m', err, '\x1b[0m')
            })

        API(retorno, res, status, isSucess)
    }

    // Pega Devices pelo ID do cliente
    async list(req, res) {
        log(`Devices do Cliente ${req.body.id_client}`, 'info')
        let isSucess = false
        let retorno = {}

        await DeviceModel.findAll({ where: { client_id: req.body.id_client } })
            .then((res) => {
                if (res === null) {
                    isSucess = false
                    retorno.msg = "Cliente não encontrado!"
                    codStatus = 404
                }else if (res.length === 0) {
                    status = 204
                    isSucess = false
                    retorno.msg = "Cliente sem Devices!"
                } else {
                    status = 200
                    isSucess = true
                    retorno.msg = " Confira seus devices abaixo!"
                    retorno.dados = res
                }
            })
            .catch((err) => {
                status = 500
                retorno.msg = "ERRO ao buscar os devices do cliente"
                retorno.dados = err
                console.error('\x1b[41m', err, '\x1b[0m')
            })

        if(isSucess){
            await ClientModel.findAll({ where: { id: retorno.dados[0].client_id } })
            .then((res) => {
                if (res.length === 0) {
                    isSucess = false
                } else {
                    status = 200
                    isSucess = true
                    retorno.client = res[0]
                    retorno.client.pass = ""

                }
            })
            .catch((err) => {
                status = 500
                retorno.dados = err
                console.error('\x1b[41m', err, '\x1b[0m')
            })
        }

        API(retorno, res, status, isSucess)
    }

    // Obtém os dados de mqtt para a placa se conectar
    async mqtt_info(req, res) {
        log(`MQTT info para o Device`, 'info')
        let isSucess = false
        let retorno = {}

        await ClientModel.findAll({ where: { id: req.body.id } })
            .then((res) => {
                if (res.length === 0) {
                    status = 403
                    isSucess = false
                    retorno.msg = "id inválido"
                } else {
                    status = 200
                    isSucess = true
                    retorno.msg = "MQTT info OK"
                    const credenciais = res[0].address_mqtt.split(":");
                    retorno.mqtt_user = credenciais[0];
                    retorno.mqtt_pass = credenciais[1];
                    retorno.mqtt_server = credenciais[2];
                    retorno.id = res[0].id;
                    retorno.nome = res[0].name;
                }
                //retorno.dados = res
            })
            .catch((err) => {
                status = 500
                retorno.msg = "ERRO ao obter as informações do MQTT"
                retorno.dados = err
                console.error('\x1b[41m', err, '\x1b[0m')
            })

        API(retorno, res, status, isSucess)
    }

    // Envia um Alerta pelo WhatsApp
    async alertaWhatsApp(req, res) {
        log(`Alerta WhatsApp`, 'info')
        let isSucess = false
        let retorno = {}
        let arrayCel = req.body.cel.split('')

        if(arrayCel[2] != '9' && req.body.cel.length != 11){
            retorno.msg = `Cel invalido!\n${req.body.cel}`
            console.log(retorno.msg)
            status = 422 // parametro do tipo certo, mas conteúdo incorreto
        }else{
            const sem_o_Nove = req.body.cel.replaceAt(2, '') // depois da atualização do Venon, só vai sem o 9
            const cel  = String("55" + sem_o_Nove + "@c.us")
            // await alertaZap(cel, req.body.msg)
            // .then((res) => {
            //     status = 200
            //     isSucess = true
            //     retorno.msg = "OK"
            //     retorno.payload = res
            // })
            // .catch((err) => {
            //     status = 500
            //     retorno.msg = err
            // })
        }

                status = 200
                isSucess = true
                retorno.msg = "OK"

        API(retorno, res, status, isSucess)
    }

    // Envia um Alerta pelo Telegram
    async alertaTelegram(req, res) {
        log(`Alerta Telegram`, 'info')
        let isSucess = false
        let retorno = {}

        // await alertaTelegram(req.body.chat_id, req.body.msg)
        //     .then((res) => {
        //         status = 200
        //         isSucess = true
        //         retorno.msg = res
        //     })
        //     .catch((err) => {
        //         status = 500
        //         retorno.msg = err
        //     })

        status = 200
        isSucess = true
        retorno.msg = "OK"

        API(retorno, res, status, isSucess)
    }

    // Envia um Alerta para Emails
    async alertaEmail(req, res) {
        log(`Alerta Email`, 'info')
        let isSucess = false
        let retorno = {}

        await alertaMail(req.body.email.toLowerCase(), req.body.titulo, req.body.corpo).then((resp) => {
            isSucess = true
            status = 200
            retorno.msg = "Envio Email OK"
        })
            .catch((err) => {
                status = 500
                console.error(err.response)
                retorno.msg = `EmailErro: ${err.response}`
            })

        API(retorno, res, status, isSucess)
    }

    // Alterar nome do Device
    async mudarNomeDevice(req, res) {
        log('Alterar nome do Device', 'info')
        let isSucess = false
        let retorno = {}

        await DeviceModel.update({ description:req.body.description }, { where: { id: req.body.id } })
        .then((res) => {
            if (res[0] === 1) {
                isSucess = true
                retorno.msg = "Nome do dispositivo atualizado!"
            } else {
                retorno.msg = "Dispositivo não encontrado!"
            }
        })
        .catch((err) => {
            retorno.msg = "ERRO ao atualizar o dispositivo"
            retorno.dados = err
            console.error('\x1b[41m', err, '\x1b[0m')
        })

        API(retorno, res, 200, isSucess);
    }

}
module.exports = new Device();