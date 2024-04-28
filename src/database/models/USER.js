const { DataTypes } = require('sequelize');
const sequelize = require('../config.js');

const USER = sequelize.define('USERS', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    /// todo... add user model
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = { USER };