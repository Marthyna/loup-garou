require('mandatoryenv').load(['DB'])
const {
    DB
} = process.env;

const Sequelize = require('sequelize');

module.exports = new Sequelize({
    dialect: 'sqlite',
    storage: DB,
    logging: (...msg) => console.log(msg)
})
