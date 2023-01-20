const API = require('../utils/API')
const log = require('../utils/log')
const encript = require('../utils/encript')
const decript = require('../utils/decript')
var jwt = require('jsonwebtoken')
const rotas = require('../utils/nome_rotas')
const ClientModel = require('../models/clients')


class Client {

    // Lista todos os Clientes
    async index(req, res) {
        log('Listar Clientes', 'info')
        let isSucess = false
        let retorno = {}

        await ClientModel.findAll()
            .then((res) => {
                isSucess = true
                retorno.msg = "Sucesso ao listar os Clientes"
                retorno.dados = res
            })
            .catch((err) => {
                retorno.msg = "ERRO ao listar os Clientes"
                retorno.dados = err
                console.error('\x1b[41m', err, '\x1b[0m')
            })

        API(retorno, res, 200, isSucess)
    }

    // Inserir um Cliente
    async insert(req, res) {
        log('Criar Cliente', 'info')
        let isSucess = false
        let retorno = {}
        let codStatus = 200

        await ClientModel.create({
            name: req.body.name,
            email: req.body.email,
            pass: encript(req.body.pass),
            cel: req.body.cel,
            address_mqtt: req.body.address_mqtt,
            obs: req.body.obs,
        })
            .then((res) => {
                isSucess = true
                retorno.msg = "Cliente cadastrado com sucesso!"
                retorno.dados = res
                retorno.dados.pass = ""
            })
            .catch((err) => {
                retorno.msg = "ERRO ao cadastrar Cliente"
                retorno.dados = err
                codStatus = 500
                console.error('\x1b[41m', err, '\x1b[0m')
            })

        API(retorno, res, codStatus, isSucess);
    }

    // Atualiza um Cliente
    async update(req, res) {
        log('Editar Cliente', 'info')
        let isSucess = false
        let retorno = {}
        let codStatus = 200
        let ClientChange

        await ClientModel.findByPk(req.body.id)
            .then((res) => {
                if (res === null) {
                    isSucess = false
                    retorno.msg = "Cliente não encontrado!"
                    codStatus = 404
                } else {
                    if(decript(req.body.old_pass, res.pass)){
                        isSucess = true
                        ClientChange = res
                    }else{
                        isSucess = false
                        retorno.msg = "Password anterior é inválido"
                        codStatus = 401
                    }
                }
            })
            .catch((err) => {
                retorno.msg = "ERRO ao buscar ID do Cliente"
                retorno.dados = err
                codStatus = 500
                console.error('\x1b[41m', err, '\x1b[0m')
            })

        if (isSucess) {
            ClientChange.name = req.body.name
            ClientChange.email = req.body.email
            ClientChange.pass = encript(req.body.pass)
            ClientChange.cel = req.body.cel
            ClientChange.address_mqtt = req.body.address_mqtt
            ClientChange.obs = req.body.obs

            await ClientChange.save()
                .then((res) => {
                    isSucess = true
                    retorno.dados = res
                    retorno.dados.pass = ""
                    retorno.msg = "Sucesso ao atualizar o Cliente"
                })
                .catch((err) => {
                    isSucess = false
                    retorno.msg = "ERRO ao atualizar o Cliente"
                    codStatus = 500
                    retorno.dados = err
                    console.error(err)
                })
        }

        API(retorno, res, codStatus, isSucess)
    }

    // Deleta um Cliente
    async delete(req, res) {
        log('Deletar Cliente', 'info')
        let isSucess = false
        let retorno = {}

        await ClientModel.destroy({ where: { id: req.params.id } })
            .then((res) => {
                if (res === 0) {
                    retorno.msg = "Erro ao apagar. Id do cliente não foi encontrado"
                    retorno.dados = res
                    isSucess = false
                } else {
                    retorno.msg = "Sucesso ao deletar o Cliente"
                    retorno.dados = res
                    isSucess = true
                }
            })
            .catch((err) => {
                retorno.msg = "ERRO ao deletar o Cliente"
                retorno.dados = err
                console.error('\x1b[41m', err, '\x1b[0m')
            })

        API(retorno, res, 200, isSucess)
    }

    // Fazer login na página WEB ou APP
    async login(req, res) {
        log(`Logando Cliente ${req.body.email}`, 'info')
        let isSucess = false
        let codStatus = 200
        let retorno = {}

        await ClientModel.findAll({ where: { email: req.body.email } })
            .then((res) => {
                if (res.length === 0) {
                    isSucess = false
                    codStatus = 404
                    retorno.msg = "Usuário inválido!"
                } else {
                    if(decript(req.body.pass, res[0].pass)){
                        isSucess = true
                        retorno.msg = "Acesso liberado!"
                        retorno.token = jwt.sign({ id: res[0].id }, process.env.SECRET, {expiresIn: process.env.JWT_EXPIRES_IN })
                        retorno.dados = res[0]
                        retorno.dados.pass = ""
                        retorno.rotas = rotas
                    }else{
                        isSucess = false
                        retorno.msg = "Password inválido"
                        codStatus = 401
                    }
                }
            })
            .catch((err) => {
                retorno.msg = "ERRO ao fazer o login."
                retorno.dados = err
                codStatus = 500
                console.error('\x1b[41m', err, '\x1b[0m')
            })

        API(retorno, res, codStatus, isSucess)
    }

    // Alterar senha
    async alterar_senha(req, res) {
        log(`Alterar Senha do Cliente`, 'info')
        let isSucess = false
        let retorno = {}
        let ClientChange
        let codStatus = 200

        await ClientModel.findByPk(req.body.id)
            .then((res) => {
                if (res === null) {
                    isSucess = false
                    retorno.msg = "Cliente não encontrado!"
                    codStatus = 404
                } else {
                    if(decript(req.body.old_pass, res.pass)){
                        isSucess = true
                        ClientChange = res
                    }else{
                        isSucess = false
                        retorno.msg = "Senha anterior é inválida"
                        codStatus = 401
                    }
                }
            })
            .catch((err) => {
                retorno.msg = "ERRO ao alterar a senha."
                retorno.dados = err
                codStatus = 500
                console.error('\x1b[41m', err, '\x1b[0m')
            })

        if (isSucess) {
            ClientChange.pass = encript(req.body.newPass)
            ClientChange.email = req.body.newUser

            await ClientChange.save()
                .then((res) => {
                    isSucess = true
                    retorno.dados = res
                    retorno.dados.pass = ""
                    retorno.msg = "Sucesso ao mudar a senha!"
                })
                .catch((err) => {
                    isSucess = false
                    retorno.msg = "ERRO ao atualizar a senha"
                    retorno.dados = err
                    console.error(err)
                })
        }

        API(retorno, res, codStatus, isSucess)
    }

}
module.exports = new Client();