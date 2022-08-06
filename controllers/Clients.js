const API = require('../utils/API')
const log = require('../utils/log')
const ClientModel = require('../models/clients')

class Client{

    // Lista todos os Clientes
    async index(req, res){
        log('Listar Clientes', 'info')
        let isSucess = false
        let retorno = {}

        await ClientModel.findAll()
        .then((res)=>{
            isSucess = true
            retorno.msg = "Sucesso ao listar os Clientes"
            retorno.dados = res
        })
        .catch((err)=>{
            retorno.msg = "ERRO ao listar os Clientes"
            retorno.dados = err
            console.error('\x1b[41m', err, '\x1b[0m')
        })

        API(retorno, res, 200, isSucess)
    }

    // Inserir um Cliente
    async insert(req, res){
        log('Criar Cliente', 'info')
        let isSucess = false
		let retorno = {}

        await ClientModel.create({
            name: req.body.name,
            email: req.body.email,
            pass: req.body.pass,
            address_mqtt: req.body.address_mqtt,
            obs: req.body.obs,
        })
        .then((res)=>{
            isSucess = true
            retorno.msg = "Cliente cadastrado com sucesso!"
            retorno.dados = res
        })
        .catch((err)=>{
            retorno.msg = "ERRO ao cadastrar Cliente"
            retorno.dados = err
            console.error('\x1b[41m', err, '\x1b[0m')
        })

        API(retorno, res, 200, isSucess);
    }

    // Atualiza um Cliente
    async update(req, res){
        log('Editar Cliente', 'info')
        let isSucess = false
		let retorno = {}
        let ClientChange

        await ClientModel.findByPk(req.body.id)
        .then((res)=>{
            if(res === null){
                isSucess = false
                retorno.msg = "Cliente não encontrado!"
            }else{
                isSucess = true
                ClientChange = res
            }
        })
        .catch((err)=>{
            retorno.msg = "ERRO ao buscar ID do Cliente"
            retorno.dados = err
            console.error('\x1b[41m', err, '\x1b[0m')
        })

        if(isSucess){
            ClientChange.name = req.body.name
            ClientChange.email = req.body.email
            ClientChange.pass = req.body.pass
            ClientChange.address_mqtt = req.body.address_mqtt
            ClientChange.obs = req.body.obs

            await ClientChange.save()
            .then((res)=>{
                isSucess = true
                retorno.dados = res
                retorno.msg = "Sucesso ao atualizar o Cliente"
            })
            .catch((err)=>{
                isSucess = false
                retorno.msg = "ERRO ao atualizar o Cliente"
                retorno.dados = err
                console.error(err);
            })
        }

        API(retorno, res, 200, isSucess);
    }

    // Deleta um Cliente
    async delete(req, res){
        log('Deletar Cliente', 'info')
        let isSucess = false
		let retorno = {}

        await ClientModel.destroy({ where: {id: req.params.id} })
        .then((res)=>{
            if(res === 0){
                retorno.msg = "Erro ao apagar. Id do cliente não foi encontrado"
                retorno.dados = res
                isSucess = false               
            }else{
                retorno.msg = "Sucesso ao deletar o Cliente"
                retorno.dados = res
                isSucess = true
            }
        })
        .catch((err)=>{
            retorno.msg = "ERRO ao deletar o Cliente"
            retorno.dados = err
            console.error('\x1b[41m', err, '\x1b[0m')
        })

        API(retorno, res, 200, isSucess)
    }

    // Fazer login na página WEB ou APP
    async login(req, res){
        log(`Logando Cliente`, 'info')
        let isSucess = false
		let retorno = {}

        await ClientModel.findAll({ where: { email: req.body.email, pass: req.body.pass } })
        .then((res)=>{
            if(res.length === 0){
                isSucess = false
                retorno.msg = "Usuário ou senha inválidos!"
            }else{
                isSucess = true
                retorno.msg = "Acesso liberado!"
            }
            retorno.dados = res
        })
        .catch((err)=>{
            retorno.msg = "ERRO ao fazer o login."
            retorno.dados = err
            console.error('\x1b[41m', err, '\x1b[0m')
        })

        API(retorno, res, 200, isSucess)
    }

}
module.exports = new Client();