const userModel = require('../models/users')
const gameModel = require('../models/game')
const userController = require('../controllers/user')
const jws = require('jws');
const propositionModel = require('../models/proposition');
const SECRET = 'pass';

// eslint-disable-next-line no-unexpected-multiline
(async () => {
  // reinitialise the database
  await require('../models/database.js').sync({ force: true })
  console.log('Base de données créée.')
  
  // put some test data in there
  const username = 'Paul';
  const password = "password1234";
  const token = jws.sign({
    header: { alg: 'HS256' },
    payload: username,
    secret: SECRET
  })
  const player = await userModel.create({
    username,
    password,
    token
  })
  const player2 = await userModel.create({
    username: "carlos",
    password: "senhadocarlos",
    token
  })

  await userModel.create({
    username: "a",
    password: "a",
    token
  })
  await userModel.create({
    username: "b",
    password: "b",
    token
  })
  await userModel.create({
    username: "c",
    password: "c",
    token
  })

  const startDate = new Date()
  startDate.setDate(startDate.getDate()+1)
  const game = await gameModel.create({
    name: "John's game",
    minNbParticipants: 5,
    maxNbParticipants: 20,
    started: false,
    dayDuration: 16,
    nightDuration: 8,
    startDate,
    contaminationProb: 1,
    insomniaProb: 1,
    clairvoyanceProb: 0,
    psychicProb: 0,
    proportionWerewolves: 0.333,
    timeVelocity: 2
  })
  const game2 = await gameModel.create({
    name: "Laura's game",
    minNbParticipants: 5,
    maxNbParticipants: 20,
    started: false,
    dayDuration: 14,
    nightDuration: 10,
    startDate,
    contaminationProb: 0,
    psychicProb: 0,
    insomniaProb: 0,
    clairvoyanceProb: 0,
    proportionWerewolves: 0.333,
    timeVelocity: 10
  })
  player.addGame(game)
  player.addGame(game2)
  player2.addGame(game)
  const proposition = await propositionModel.create({
    authorVillager: 2,
    proposedVillager: 2,
    nbVotes: 1
  })
  game.addProposition(proposition)



})()