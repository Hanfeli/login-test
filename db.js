// const mysql2 = require('mysql2')

// const db = mysql2.createConnection({
//     host: "127.0.0.1",
//     user: "root",
//     password: "KenKone@2#",
//     database: "sys"
// })

// exports.db = db



const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sys', 'root', 'KenKone@2#', {
  host: '127.0.0.1',
  dialect: 'mysql',
});

module.exports = sequelize;