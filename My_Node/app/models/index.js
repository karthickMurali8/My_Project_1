const dbConfig = require('../config/db.config');
const Sequelize = require('sequelize');

var sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    define: {
        //prevent sequelize from pluralizing table names
        freezeTableName: true
    },
  
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
});

const db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    users: require('./user.model')(Sequelize, sequelize)
};

module.exports = db;