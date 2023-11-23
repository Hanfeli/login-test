const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('EVAS_GI', 'root', 'ken82822428kone', {
  host: '192.168.50.20',
  port: 33082,
  dialect: 'mysql',
});

module.exports = sequelize;