const { Sequelize } = require('sequelize');

const db_host = "localhost";
const db_port = "1433";
const db_name = "sa";
const db_pass = "sa";

const sequelize = new Sequelize(db_name, 'sa', db_pass, {
    host: db_host,
    dialect: 'mssql',
    port: db_port,
    dialectOptions: {
        options: {
            trustServerCertificate: true,
        },
    },
});

module.exports = sequelize;