const { DataTypes } = require('sequelize');
const sequelize = require('../db.js'); // 注意這裡的路徑可能需要根據你的實際結構調整

const User = sequelize.define('users', {
  username: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  disabled: {
    type: DataTypes.BOOLEAN,
  },
  email:{
    type: DataTypes.STRING,
  }
});

module.exports = User;
