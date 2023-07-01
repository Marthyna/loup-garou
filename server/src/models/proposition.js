const Sequelize = require('sequelize')
const db = require('./database')
const game = require('./game')

const proposition = db.define('proposition', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  authorVillager: {
    type: Sequelize.INTEGER
  },
  proposedVillager: {
    type: Sequelize.INTEGER
  },
  nbVotes: {
    type: Sequelize.INTEGER
  }
}, { timestamps: false })

// models the association of proposition an game (one-to-many)
game.hasMany(proposition)
proposition.belongsTo(game)

module.exports = proposition