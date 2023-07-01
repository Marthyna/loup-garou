// models
const matchModel = require('../models/game')
const userModel = require('../models/users')

// controllers
const wsController = require('./websocket')
const villagerController = require('./villager')
const chatController = require('./chat')
const propositionController = require('./proposition')

// utils
const headers = require('../util/validation/headers.js')
const jsonParser = require('../util/parsing/jsonParser.js')
const CodeError = require('../util/CodeError')
const { determineRoles, determinePowers } = require('../util/assigner')
const { ChatType } = require('../util/chatType')
const { resetAllPowers } = require('./powers')

const deleteIfInactiveGame = async (id) => {
    // check if there are any players associated to this object
    const players = await getPlayers(id)

    // if there are no players in the match, delete it
    if( isEmptyMatch(players) )
        await matchModel.destroy({
            where: { id }
        })
}


const isStartedGame = async (id) => {
    // retrieve the game, with its attribute started
    const {started} = await matchModel.findOne({
        attributes: ["started"],
        where: {
            id
        }
    })

    if(started == false)
        return false
    return true

}


const isEmptyMatch = (playersList) => {
    if( playersList == null         ||
        (
            playersList.length == 1                     &&
            playersList[0].hasOwnProperty('users')      &&
            playersList[0].users.id == null             &&
            playersList[0].users.username == null
        )
    )
        return true
    return false
}


const isValidMatch = async (gameId) => {
    // check if the match has already started
    // or if there are any players there
    const started = await isStartedGame(gameId)
    const players = await getPlayers(gameId)
    const isEmpty = isEmptyMatch(players)

    if(started || isEmpty)
        return false
    return true
}


const getPlayers = async (id) => {
    const data = await matchModel.findAll({
        raw: true,
        nest: true,
        attributes: ["name"],
        where: {
            id
        },
        include: [{
            model: userModel,
            attributes: ["id", "username"],
            through: {
                attributes: []
            }
        }]
    })

    // check if any players were found for that match, if not, return null
    if(isEmptyMatch(data))
        return null

    // otherwise, create the object and return it
    const players = data.map(el => {
        return {
            id: el.users.id,
            username: el.users.username
        }
    
    })
    return players

}


const getNotStartedMatches = async (req, res) => {
    // get the matches that haven't started yet
    const notStartedMatches = await queryNotStarted()

    // send the data
    res.json({
        notStartedMatches
    })
}


const queryNotStarted = async () => {
    const notStarted = await matchModel.findAll({ 
        attributes: [
            'id',
            'name'
        ],
        where: {
            started: false
        }
    })

    return notStarted;
}


const newGame = async (req, res) => {
    // verify the headers    
    headers.verifyDataHeader(req)

    // retrieve all the user parameters from the request
    const parameters = jsonParser.getParameters(req)

    // with that, we can create a new object in the db
    const gameId = await createNewGame(parameters)

    // send the new gameId to the client
    res.json({
        gameId
    })
}


const getAllGameParameters = async (gameId) => {
    
    const parametersArray = [
        "minNbParticipants",
        "maxNbParticipants",
        "started",
        "dayDuration",
        "nightDuration",
        "startDate",
        "insomniaProb",
        "contaminationProb",
        "clairvoyanceProb",
        "psychicProb",
        "proportionWerewolves",
        "timeVelocity"
    ]
    
    return getGameParameters(gameId, parametersArray)
}


const getGameParameters = async (id, parameters) => {
    const parametersQuery = await matchModel.findOne({ 
        attributes: parameters,
        where: {
            id
        }
    })

    return parametersQuery
}


const assignGameRoles = async (gameId, players) => {
    // for every player, assign the rules according to the game parameters
    const parameters = [
        "insomniaProb",
        "contaminationProb",
        "clairvoyanceProb",
        "psychicProb",
        "proportionWerewolves"
    ]
    // get the desired parameters
    const {
        insomniaProb,
        contaminationProb,
        clairvoyanceProb,
        psychicProb,
        proportionWerewolves
    } = await getGameParameters(gameId, parameters)

    // determine who is going to be a werewolf and who is going to be human
    const playerRoles = determineRoles(players, proportionWerewolves)

    const powerProbs = {insomniaProb, contaminationProb, clairvoyanceProb, psychicProb}
    // get what power should be assigned to which player (if any, of course)
    const playersPowers = determinePowers(playerRoles, powerProbs)

    return playersPowers
}

const createStructures = async (gameId) => {
    // creates the necessary data structures to the game
    const players = await getPlayers(gameId)
    
    // assign the roles to each player
    const playersRoles = await assignGameRoles(gameId, players)
    
    // for all players, create a villager associated with a user and a game
    playersRoles.forEach(({id, isWerewolf, hasPower, powerType}) => {
        const userId = id
        villagerController.createVillager(userId, gameId, isWerewolf, hasPower, powerType)
    });

    return playersRoles
}


const setStarted = async (id, value) => {
    // check if the value is valid
    if(value !== false && value !== true)
        return false
    
    // updates the started value to the new value
    await matchModel.update(
        {started: value},
        {where: {
            id
        }}
    )
}


const setDayTimeout = (gameId, dayDuration, nightDuration) => {
    // as the function setTimeout takes the argument in ms, we convert it
    const msNightDuration = nightDuration *60 *60 *100
    setTimeout(async (gameId, dayDuration, nightDuration) => {
        // do something only if the game is not ended
        const isEnded = await getIsEnded(gameId)
        if(isEnded) return;


        console.log("IT IS DAY!");
        // we set the day time
        setDayTime(gameId, 'day')


        // archive all messages from the park chat in the db
        chatController.archiveMessages(gameId, ChatType.Park)
        
        // delete all propositions
        propositionController.deleteAllGameProposition(gameId)

        // we make sure that all powers are impossible to be used (by setting the usedPower to true)
        resetAllPowers(gameId, true)

        // alert the players of the change
        wsController.alertNightDayChange(gameId, 'dayTime')

        // set the next change (from day to night)
        setNightTimeout(gameId, dayDuration, nightDuration)
    }, 
    // msNightDuration
    10000, gameId, dayDuration, nightDuration
    )
}


const setNightTimeout = (gameId, dayDuration, nightDuration) => {
    // as the function setTimeout takes the argument in ms, we convert it
    const msDayDuration = dayDuration *60 *60 *100
    setTimeout(async (gameId, dayDuration, nightDuration) => {
        // do something only if the game is not ended
        const isEnded = await getIsEnded(gameId)
        if(isEnded) return;
    
        console.log("IT IS NIGHT!");
        setDayTime(gameId, 'night')
        // archive all messages from the park chat in the db
        chatController.archiveMessages(gameId, ChatType.Werewolf)

        // delete all propositions
        propositionController.deleteAllGameProposition(gameId)

        // we reset the usability of powers by indicating it was not used this round        
        resetAllPowers(gameId, false)

        // alert the players of the change
        wsController.alertNightDayChange(gameId, 'nightTime')

        // set the next change (from night to day)
        setDayTimeout(gameId, dayDuration, nightDuration)

    }, 
        // msDayDuration
        10000, gameId, dayDuration, nightDuration
    )
}


const setDayNightSwitchInterval = async (id) => {
    // get the day and night times
    const {dayDuration, nightDuration} = await matchModel.findOne({
        attributes: ["dayDuration", "nightDuration"],
        where: { id }
    })

    // set the toggling timeouts
    setNightTimeout(id, dayDuration, nightDuration)
}


const startGame = async (gameId) => {
    console.log("STARTING GAME!");
    // create the structures necessary to the game
    const rolesAndPowers = await createStructures(gameId)
    // retrieve the players
    const players = await getPlayers(gameId)

    // set the started flag to true in the database
    await setStarted(gameId, true)

    // alert to all clients that the game started
    wsController.alertGameStart(gameId, players, rolesAndPowers)

    // and set the function that will keep
    // track of the time to start the night
    setDayNightSwitchInterval(gameId)
}


const checkGameStartByMaxPlayers = async (gameId) => {
    // retrieve the game and check the number of players
    // if the expected number of players is achieved, we need to start the match
    let {maxNbParticipants} = await getGameParameters(gameId, ["maxNbParticipants"])
    const players = await getPlayers(gameId)

    maxNbParticipants = 3
    if(players && players.length == maxNbParticipants) 
        startGame(gameId)

}


const checkGameStartByTime = async (gameId) => {
    // check if the game is not already start
    const started = await isStartedGame(gameId)
    const { minNbParticipants } = await getGameParameters(gameId, ["minNbParticipants"])
    const players = await getPlayers(gameId)

    if(!started && players && players.length >= minNbParticipants) {
        startGame(gameId)
    }
}


const setGameStartByTime = (startDate, gameId) => {
    // we take the difference between the two time objects
    // that will retrieve the time in ms
    const startDateObject = new Date(startDate)
    const dateNow = new Date()

    const timeToStart = startDateObject - dateNow

    // and we set a function to be checked after the interval
    setTimeout(async () => {
        await checkGameStartByTime(gameId)
    }, timeToStart, gameId)

}


const convertTime = (duration) => {
    // convert night duration to a number
    const timeArray = duration.split(':')
    return (parseInt(timeArray[0])+ (parseInt(timeArray[1])/60))
}


const createNewGame = async ({
    name,
    minNbParticipants,
    maxNbParticipants,
    dayDuration,
    nightDuration,
    startDate,
    werewolfProp,
    contaminationProb,
    insomniaProb,
    clairvoyanceProb,
    psychicProb
}) => {
    // convert night duration to a number
    // const test = nightDuration
    nightDuration = convertTime(nightDuration)

    // convert day duration to a number
    dayDuration = convertTime(dayDuration)

    // create the match in the db
    const newMatch = await matchModel.create({
        name,
        minNbParticipants,
        maxNbParticipants,
        // set started to false
        started: false,
        dayDuration,
        nightDuration,
        startDate,
        proportionWerewolves: werewolfProp,
        contaminationProb,
        insomniaProb,
        clairvoyanceProb,
        psychicProb,
        dayTime: 'day',
        isEnded: false
    })

    // set an interval to check if the game should start or not
    const {id} = newMatch
    setGameStartByTime(startDate, id)

    return id
}


const setDayTime = async (gameId, value) => {
    await matchModel.update(
        { dayTime: value },
        {
            where: {
                id: gameId
            }
        }
    )
}


const getDayTime = async (gameId) => {
    // get the dayTime of a game ('day' or 'night')
    const {dayTime} = await matchModel.findByPk(gameId)
    return dayTime
}


const getIsEnded = async (gameId) => {
    const {isEnded} = await matchModel.findByPk(gameId)
    return isEnded
}


const setIsEnded = async (gameId, value) => {
    await matchModel.update(
        {isEnded: value},
        {
            where: {
                id: gameId
            }
        }
    )
}


const endGame = async (gameId, winner) => {
    // indicate that the game endeed in the db
    await setIsEnded(gameId, true)

    // when the game ends, all messages are made available to everyone
    const {parkMessages, werewolfMessages} = await chatController.getAllMessages(gameId)

    // alert all players that the game ended, and send all the game messages
    wsController.alertGameEnd(gameId, winner, {parkMessages, werewolfMessages})
}


const checkGameEnded = async (gameId) => {
    // in order to see if the game ended, we check if there is only werewolves, or only humans
    const nbAliveWerewolves = await villagerController.getAliveWerewolves(gameId)
    const nbAliveHumans = await villagerController.getAliveHumans(gameId)

    if(nbAliveWerewolves == 0) {
        // if humans won
        endGame(gameId, 'humans')
    }
    else if(nbAliveHumans == 0) {
        // if werewolves won
        endGame(gameId, 'werewolfs')
    } else {
        // if the game still doesn't have a winner
        return false
    }

    return true
}


exports.getPlayers = getPlayers
exports.getDayTime = getDayTime
exports.checkGameEnded = checkGameEnded

module.exports = {
    getNotStartedMatches,
    getPlayers,
    newGame,
    isValidMatch,
    deleteIfInactiveGame,
    checkGameStartByMaxPlayers,
    startGame,
    getAllGameParameters,
    getDayTime,
    checkGameEnded,
    getIsEnded
}