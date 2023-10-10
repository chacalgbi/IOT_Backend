const nodemailer = require("nodemailer")
require('dotenv').config()

module.exports = function email(email, titulo, msg) {
    return new Promise((resolve, reject) => {
        const user = process.env.EMAIL
        const pass = process.env.SENHA
        const host = process.env.HOST

        let transporter = nodemailer.createTransport({
            host: host,
            port: 465,
            secure: true,
            auth: { user, pass }
        })

        transporter.sendMail({
            from: user,
            to: email,
            subject: titulo,
            text: msg
        })
        .then((res) => {
            resolve(res)
        })
        .catch((err) => {
            reject(err)
        })
    })
}