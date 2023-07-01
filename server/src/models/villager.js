const Sequelize = require('sequelize')
const db = require('./database')
const groupMessage = require('./groupMessage')
const gameModel = require('./game')

const villager = db.define('villager', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  isAlive: {
    type: Sequelize.BOOLEAN
  },
  canVote: {
    type: Sequelize.BOOLEAN
  },
  isWerewolf: {
    type: Sequelize.BOOLEAN
  },
  hasPower: {
    type: Sequelize.BOOLEAN
  },
  powerType: {
    // will model the power as an ENUM
    type: Sequelize.INTEGER
  },
  usedPower: {
    type: Sequelize.BOOLEAN
  }
}, { timestamps: false })


// models the association of user and groupMessage (one-to-many)
villager.hasMany(groupMessage)
groupMessage.belongsTo(villager)

// models the association between game and villager (one-to-one)
gameModel.hasMany(villager)
villager.belongsTo(gameModel)


module.exports = villager