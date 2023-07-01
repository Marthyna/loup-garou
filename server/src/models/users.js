const Sequelize = require('sequelize')
const db = require('./database')
const game = require('./game')
const villager = require('./villager')
const { userGames } = require('./associations')

const user = db.define('user', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  username: {
    type: Sequelize.STRING(128),
    validate: {
      is: /^[a-z\-'\s]{1,128}$/i
    }
  },
  password: {
    type: Sequelize.STRING(60),
    // TODO
    // insert the regex that validates it
  },
  token: {
    type: Sequelize.STRING(60)
  }
}, { timestamps: false })

// models the association of match and user (many-to-many)
user.belongsToMany(game, {
  through: userGames
})
game.belongsToMany(user, {
  through: userGames
})

// models the association of user and villager (in a already started game)
user.hasOne(villager)
villager.belongsTo(user)


module.exports = user