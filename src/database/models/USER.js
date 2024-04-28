const { DataTypes } = require('sequelize');
const sequelize = require('../config.js');

const USER = sequelize.define('USERS', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    EMAIL: {
        type: DataTypes.STRING,
        allowNull: false
    },
    PASSWORD: {
        type: DataTypes.STRING,
        allowNull: true
    },
    SALT: {
        type: DataTypes.STRING,
        allowNull: true
    },
    IS_SELLER: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    NUMBER_OF_BONUSES: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    UNIQUE_CODE: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = { USER };