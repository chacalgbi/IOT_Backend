const Sequelize = require('sequelize')
const database = require('../dataBase')

const Channels = database.define('channels', {
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
    device_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false
    },
    platform: {
        type: Sequelize.STRING,
        allowNull: false
    },
    path: {
        type: Sequelize.STRING,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    color: {
        type: Sequelize.STRING,
        allowNull: true
    },
    range: {
        type: Sequelize.STRING,
        allowNull: true
    },
    array_info: {
        type: Sequelize.STRING,
        allowNull: true
    },
    label: {
        type: Sequelize.STRING,
        allowNull: true
    },
    previous_state: {
        type: Sequelize.STRING,
        allowNull: true
    },
    obs: {
        type: Sequelize.TEXT,
        allowNull: true
    }
})

module.exports = Channels