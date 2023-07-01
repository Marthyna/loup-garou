const Sequelize = require('sequelize')
const gameModel = require('./game')
const db = require('./database')

const groupMessage = db.define('groupMessage', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  messageContent: {
    type: Sequelize.STRING(200)
  },
  messageType: {
    type: Sequelize.INTEGER,
  },
  archived: {
    type: Sequelize.BOOLEAN
  },
  timeStamp: {
    type: Sequelize.DATE
  },
  // there is also the sender and the game it is related to
  // but this will be set up by the associations (hence, it does not appear here)
}, { timestamps: false })

// model the association between game and groupMessage (one-to-many)
gameModel.hasMany(groupMessage)
groupMessage.belongsTo(gameModel)



module.exports = groupMessage