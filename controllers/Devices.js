const API = require('../utils/API')
const log = require('../utils/log')
const DeviceModel = require('../models/devices')

class Device{

    // Lista todos os Devices
    async index(req, res){
        log('Listar Devices', 'info')
        let isSucess = false
        let retorno = {}

        await DeviceModel.findAll()
        .then((res)=>{
            isSucess = true
            retorno.msg = "Sucesso ao listar os Devices"
            retorno.dados = res
        })
        .catch((err)=>{
            retorno.msg = "ERRO ao listar os Devices"
            retorno.dados = err
            console.error('\x1b[41m', err, '\x1b[0m')
        })

        API(retorno, res, 200, isSucess)
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
            isSucess = true
            retorno.msg = "Device cadastrado com sucesso!"
            retorno.dados = res
        })
        .catch((err)=>{
            retorno.msg = "ERRO ao cadastrar Device"
            retorno.dados = err
            console.error('\x1b[41m', err, '\x1b[0m')
        })

        API(retorno, res, 200, isSucess);
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
                isSucess = false
                retorno.msg = "Device não encontrado!"
            }else{
                isSucess = true
                DeviceChange = res
            }
        })
        .catch((err)=>{
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
                isSucess = false
                retorno.msg = "ERRO ao atualizar o Device"
                retorno.dados = err
                console.error(err);
            })
        }

        API(retorno, res, 200, isSucess);
    }

    // Deleta um Device
    async delete(req, res){
        log('Deletar Device', 'info')
        let isSucess = false
		let retorno = {}

        await DeviceModel.destroy({ where: {id: req.params.id} })
        .then((res)=>{
            if(res === 0){
                retorno.msg = "Erro ao apagar. Id do Device não foi encontrado"
                retorno.dados = res
                isSucess = false               
            }else{
                retorno.msg = "Sucesso ao deletar o Device"
                retorno.dados = res
                isSucess = true
            }
        })
        .catch((err)=>{
            retorno.msg = "ERRO ao deletar o Device"
            retorno.dados = err
            console.error('\x1b[41m', err, '\x1b[0m')
        })

        API(retorno, res, 200, isSucess)
    }

    // Fazer login no Device
    async login(req, res){
        log(`Logando Device`, 'info')
        let isSucess = false
		let retorno = {}

        await DeviceModel.findAll({ where: { token: req.body.token } })
        .then((res)=>{
            if(res.length === 0){
                isSucess = false
                retorno.msg = "Token inválido!"
            }else{
                isSucess = true
                retorno.msg = "Acesso liberado!"
            }
            retorno.dados = res
        })
        .catch((err)=>{
            retorno.msg = "ERRO ao fazer o login do Device."
            retorno.dados = err
            console.error('\x1b[41m', err, '\x1b[0m')
        })

        API(retorno, res, 200, isSucess)
    }

}
module.exports = new Device();