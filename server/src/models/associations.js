const Sequelize = require('sequelize')
const db = require('./database')

// defines the association between user and games (many-to-many)
const userGames = db.define('userGames', {    
}, { timestamps: false })


module.exports = {
    userGames
}