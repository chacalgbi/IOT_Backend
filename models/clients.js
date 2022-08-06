const Sequelize = require('sequelize')
const database = require('../dataBase')

const Client = database.define('client', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    pass: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address_mqtt: {
        type: Sequelize.STRING,
        allowNull: true
    },
    obs: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

module.exports = Client