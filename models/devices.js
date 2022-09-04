const Sequelize = require('sequelize')
const database = require('../dataBase')

const Device = database.define('device', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    client_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    device: {
        type: Sequelize.STRING,
        allowNull: false
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false
    },
    pathUpdate: {
        type: Sequelize.STRING,
        allowNull: true
    },
    obs: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

module.exports = Device