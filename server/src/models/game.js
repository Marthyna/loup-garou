const Sequelize = require('sequelize')
const db = require('./database')

const game = db.define('game', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(60)
  },
  minNbParticipants: {
    type: Sequelize.INTEGER
  },
  maxNbParticipants: {
    type: Sequelize.INTEGER
  },
  started: {
    type: Sequelize.BOOLEAN
  },
  dayDuration: {
    // will take values such as 0, 0.5, 1, 1.5, ...
    type: Sequelize.FLOAT
  },
  nightDuration: {
    type: Sequelize.FLOAT
  },
  startDate: {
    type: Sequelize.DATE
  },
  insomniaProb: {
    type: Sequelize.FLOAT
  },
  contaminationProb: {
    type: Sequelize.FLOAT
  },
  clairvoyanceProb: {
    type: Sequelize.FLOAT
  },
  psychicProb: {
    type: Sequelize.FLOAT
  },
  proportionWerewolves: {
    type: Sequelize.FLOAT
  },
  dayTime: {
    type: Sequelize.STRING(50)
  },
  isEnded: {
    type: Sequelize.BOOLEAN
  },
  timeVelocity: {
    // it's going to be a multiplier
    type: Sequelize.INTEGER
  }
}, { timestamps: false })


module.exports = game