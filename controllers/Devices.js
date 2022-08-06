const API = require('../utils/API')
const log = require('../utils/log')
const DeviceModel = require('../models/devices')
let status = 0

class Device{

    // Lista todos os Devices
    async index(req, res){
        log('Listar Devices', 'info')
        let isSucess = false
        let retorno = {}

        await DeviceModel.findAll()
        .then((res)=>{
            status = 200
            isSucess = true
            retorno.msg = "Sucesso ao listar os Devices"
            retorno.dados = res
        })
        .catch((err)=>{
            status = 500
            retorno.msg = "ERRO ao listar os Devices"
            retorno.dados = err
            console.error('\x1b[41m', err, '\x1b[0m')
        })

        API(retorno, res, status, isSucess)
    }

    // Inserir um Device
    async insert(req, res){
        log('Criar Device', 'info')
        let isSucess = false
		let retorno = {}

        await DeviceModel.create({
            client_id: req.body.client_id,
            description: req.body.description,
            device: req.body.device,
            token: req.body.token,
            obs: req.body.obs,
        })
        .then((res)=>{
            status = 200
            isSucess = true
            retorno.msg = "Device cadastrado com sucesso!"
            retorno.dados = res
        })
        .catch((err)=>{
            status = 500
            retorno.msg = "ERRO ao cadastrar Device"
            retorno.dados = err
            console.error('\x1b[41m', err, '\x1b[0m')
        })

        API(retorno, res, status, isSucess);
    }

    // Atualiza um Device
    async update(req, res){
        log('Editar Device', 'info')
        let isSucess = false
		let retorno = {}
        let DeviceChange

        await DeviceModel.findByPk(req.body.id)
        .then((res)=>{
            if(res === null){
                status = 404
                isSucess = false
                retorno.msg = "Device não encontrado!"
            }else{
                isSucess = true
                DeviceChange = res
            }
        })
        .catch((err)=>{
            status = 500
            retorno.msg = "ERRO ao buscar ID do Device"
            retorno.dados = err
            console.error('\x1b[41m', err, '\x1b[0m')
        })

        if(isSucess){
            DeviceChange.client_id = req.body.client_id
            DeviceChange.description = req.body.description
            DeviceChange.device = req.body.device
            DeviceChange.token = req.body.token
            DeviceChange.obs = req.body.obs

            await DeviceChange.save()
            .then((res)=>{
                isSucess = true
                retorno.dados = res
                retorno.msg = "Sucesso ao atualizar o Device"
            })
            .catch((err)=>{
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
    async delete(req, res){
        log('Deletar Device', 'info')
        let isSucess = false
		let retorno = {}

        await DeviceModel.destroy({ where: {id: req.params.id} })
        .then((res)=>{
            if(res === 0){
                status = 404
                retorno.msg = "Erro ao apagar. Id do Device não foi encontrado"
                retorno.dados = res
                isSucess = false               
            }else{
                status = 200
                retorno.msg = "Sucesso ao deletar o Device"
                retorno.dados = res
                isSucess = true
            }
        })
        .catch((err)=>{
            status = 500
            retorno.msg = "ERRO ao deletar o Device"
            retorno.dados = err
            console.error('\x1b[41m', err, '\x1b[0m')
        })

        API(retorno, res, status, isSucess)
    }

    // Fazer login no Device
    async login(req, res){
        log(`Logando Device`, 'info')
        let isSucess = false
		let retorno = {}

        await DeviceModel.findAll({ where: { token: req.body.token } })
        .then((res)=>{
            if(res.length === 0){
                status = 403
                isSucess = false
                retorno.msg = "Token inválido!"
            }else{
                status = 200
                isSucess = true
                retorno.msg = "Acesso liberado!"
            }
            retorno.dados = res
        })
        .catch((err)=>{
            status = 500
            retorno.msg = "ERRO ao fazer o login do Device."
            retorno.dados = err
            console.error('\x1b[41m', err, '\x1b[0m')
        })

        API(retorno, res, status, isSucess)
    }

}
module.exports = new Device();