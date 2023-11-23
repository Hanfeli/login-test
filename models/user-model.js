const { DataTypes } = require('sequelize');
const sequelize = require('../db.js'); // 注意這裡的路徑可能需要根據你的實際結構調整

const User = sequelize.define('user', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  place: {
    type: DataTypes.STRING,
  },
  age: {
    type: DataTypes.INTEGER,
  }
},{
    tableName: 'user',
    timestamps: false ,
  });

module.exports = User;
