const API = require('../utils/API')
const log = require('../utils/log')
const ChannelModel = require('../models/channels')
let status = 0

class Channel {

    // Pega Channels pelo ID do cliente
    async channels_list(req, res) {
        log(`Channels por Cliente ${req.body.client_id}`, 'info')
        let isSucess = false
        let retorno = {}

        await ChannelModel.findAll({ where: { client_id: req.body.client_id } })
            .then((res) => {
                if (res.length === 0) {
                    status = 403
                    isSucess = false
                    retorno.msg = "Channels inválido!"
                } else {
                    status = 200
                    isSucess = true
                    retorno.msg = " Confira seus channels abaixo!"
                }
                retorno.dados = res
            })
            .catch((err) => {
                status = 500
                retorno.msg = "ERRO ao buscar os Channels do Cliente: " + req.body.client_id
                retorno.dados = err
                console.error('\x1b[41m', err, '\x1b[0m')
            })

        API(retorno, res, status, isSucess)
    }

    // Lista todos os Channels
    async index(req, res) {
        log('Listar Channels', 'info')
        let isSucess = false
        let retorno = {}

        await ChannelModel.findAll()
            .then((res) => {
                isSucess = true
                retorno.msg = "Sucesso ao listar os Channels"
                retorno.dados = res
            })
            .catch((err) => {
                retorno.msg = "ERRO ao listar os Channels"
                retorno.dados = err
                console.error('\x1b[41m', err, '\x1b[0m')
            })

        API(retorno, res, 200, isSucess)
    }

    // Inserir um Channel
    async insert(req, res) {
        log('Criar Channel', 'info')
        let isSucess = false
        let retorno = {}

        await ChannelModel.create({
            client_id: req.body.client_id,
            device_id: req.body.device_id,
            category: req.body.category,
            platform: req.body.platform,
            path: req.body.path,
            type: req.body.type,
            color: req.body.color,
            range: req.body.range,
            array_info: req.body.array_info,
            label: req.body.label,
            previous_state: req.body.previous_state,
            obs: req.body.obs
        })
            .then((res) => {
                isSucess = true
                retorno.msg = "Channel cadastrado com sucesso!"
                retorno.dados = res
            })
            .catch((err) => {
                retorno.msg = "ERRO ao cadastrar Channel"
                retorno.dados = err
                console.error('\x1b[41m', err, '\x1b[0m')
            })

        API(retorno, res, 200, isSucess);
    }

    // Atualiza um Channel
    async update(req, res) {
        log('Editar Channel', 'info')
        let isSucess = false
        let retorno = {}
        let ChannelChange

        await ChannelModel.findByPk(req.body.id)
            .then((res) => {
                if (res === null) {
                    isSucess = false
                    retorno.msg = "Channel não encontrado!"
                } else {
                    isSucess = true
                    ChannelChange = res
                }
            })
            .catch((err) => {
                retorno.msg = "ERRO ao buscar ID do Channel"
                retorno.dados = err
                console.error('\x1b[41m', err, '\x1b[0m')
            })

        if (isSucess) {
            ChannelChange.client_id = req.body.client_id
            ChannelChange.device_id = req.body.device_id
            ChannelChange.category = req.body.category
            ChannelChange.platform = req.body.platform
            ChannelChange.path = req.body.path
            ChannelChange.type = req.body.type
            ChannelChange.color = req.body.color
            ChannelChange.range = req.body.range
            ChannelChange.array_info = req.body.array_info
            ChannelChange.label = req.body.label
            ChannelChange.previous_state = req.body.previous_state
            ChannelChange.obs = req.body.obs

            await ChannelChange.save()
                .then((res) => {
                    isSucess = true
                    retorno.dados = res
                    retorno.msg = "Sucesso ao atualizar o Channel"
                })
                .catch((err) => {
                    isSucess = false
                    retorno.msg = "ERRO ao atualizar o Channel"
                    retorno.dados = err
                    console.error(err);
                })
        }

        API(retorno, res, 200, isSucess);
    }

    // Deleta um Channel
    async delete(req, res) {
        log('Deletar Channel', 'info')
        let isSucess = false
        let retorno = {}

        await ChannelModel.destroy({ where: { id: req.params.id } })
            .then((res) => {
                if (res === 0) {
                    retorno.msg = "Erro ao apagar. Id do Channel não foi encontrado"
                    retorno.dados = res
                    isSucess = false
                } else {
                    retorno.msg = "Sucesso ao deletar o Channel"
                    retorno.dados = res
                    isSucess = true
                }
            })
            .catch((err) => {
                retorno.msg = "ERRO ao deletar o Channel"
                retorno.dados = err
                console.error('\x1b[41m', err, '\x1b[0m')
            })

        API(retorno, res, 200, isSucess)
    }

}
module.exports = new Channel();