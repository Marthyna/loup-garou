const ws = require('ws')
const gameController = require('./match')
const userController = require('./user');
const villagerController = require('./villager')
const chatController = require('./chat')
const propositionController = require('./proposition')
const powerController = require('./powers')
const { ChatType } = require('../util/chatType');

let wsServer;

const createMessage = (type, data) => {
    return JSON.stringify({
        type,
        data
    })
}


const getUrlId = (req) => {
    const urldata = new URLSearchParams(req.url)
    return urldata.get("/id")
}


const initWebsocket = () => {
    wsServer = new ws.Server({ port: 8080 });

    // conection handler
    wsServer.on('connection', (ws, req) => {
        // indicate the connection to the socket
        ws.send("connected")

        ws.on('message', message => {
            // indicate the received message and ack it to the client
            console.log("Received message:", message);

            // parse message to JSON
            const parsedMessage = JSON.parse(message)
            const { messageType } = parsedMessage

            // determine the message type
            switch (messageType) {
                case 'lobbyInit':
                    handleLobbyLogin(ws, parsedMessage.data)
                    break;
                case 'lobbyLogout':
                    handleLobbyLogout(ws, parsedMessage.data)
                    break;
                case 'groupMessage':
                    handleGroupMessage(ws, parsedMessage.data)
                    break;
                case 'proposition':
                    handleNewProposition(ws, parsedMessage.data)
                    break;
                case 'vote':
                    handlePropositionVote(ws, parsedMessage.data)
                    break;
                case 'power':
                    handlePowerUse(ws, parsedMessage.data)
                    break;
            }

        })

        ws.on('close', (message) => {
            console.log("close!", message);
        })

    })
}


const handleLobbyLogin = async (ws, { token, userId, matchId }) => {
    // set the client match id
    ws.matchId = matchId
    ws.userId = userId

    // we can already send the settings data
    sendGameParameters(ws, matchId)

    // when the player logs in, we need to associate him to the match
    userController.associateGame(userId, matchId)
        .then(() => {
            sendPlayers(ws, matchId)

            // and also, we need to check wheter the game has achieved the maximum
            // capacity of players, and if so, start the game
            gameController.checkGameStartByMaxPlayers(matchId)
        })

}


const handleLobbyLogout = async (ws, { token, userId, matchId }) => {
    // we need to undo the association of the match and the game
    await userController.dissociateGame(userId, matchId)

    // check if there are any playes in the game, if not, delete the game
    await gameController.deleteIfInactiveGame(matchId)

    // and refresh the list of players
    sendPlayers(ws, matchId)
}



const handleGroupMessage = async (ws, { token, gameId, userId, chatType, messageContent }) => {
    console.log("handling group message!");
    // the timestamp is added serverside 
    // (the hour the message is validate is what counts)
    const timeStamp = new Date()

    // check if the message is valid (server-side verification)
    const canSendMessage = await chatController.checkCanSendMessage(gameId, userId, chatType)
    if(!canSendMessage) {
        return false;
    }

    // save the message in the db
    chatController.createMessage({
        userId,
        gameId,
        messageContent,
        messageType: chatType,
        timeStamp
    })

    // get the username of who is sending the message
    const sender = await userController.getUsername(userId)
    const message = {
        userId,
        sender,
        messageContent,
        timeStamp
    }

    if (chatType == ChatType.Park)
        sendParkMessage(gameId, message)
    else
        sendWerewolfMessage(gameId, message)
}


const handlePropositionVote = async (ws, { token, gameId, userId, propositionId }) => {
    console.log("handling proposition vote!");

    // in order to make the vote, we need to retrieve the villager associated to this user
    const associatedVillager = await villagerController.getVillagerByUser(userId)
    const { id } = associatedVillager

    // check if the villager succeeded to vote
    const voteSuccess = await propositionController.villagerVote(gameId, propositionId, id)
    // if failed attempt, allert the player
    if (!voteSuccess) {
        ws.send(
            createMessage('voteFail', null)
        )
    }
}


const handleNewProposition = async (ws, { token, gameId, userId, proposedUserId }) => {
    console.log("handling new proposition");

    // get the villager associated with the user proposed
    const proposedVillagerObject = await villagerController.getVillagerByUser(proposedUserId)
    const proposedVillager = proposedVillagerObject.id

    // get the villager associated to the user (which is the author)
    const { id } = await villagerController.getVillagerByUser(userId)

    // create a new proposition 
    const creationSuccess = await propositionController.createProposition(gameId, id, proposedVillager)
    // if ratified, we do nothing
    if(!creationSuccess)
        return
    
    // otherwise, we notify the clients
    const { propositionId, nbVotes } = creationSuccess

    // to send it to the client, we get the username of the creator and the proposed villager
    const usernameAuthor = await userController.getUsername(userId)
    const usernameProposed = await userController.getUsername(proposedUserId)

    // get the players that were not proposed yet
    const proposablePlayers = await propositionController.getNotProposedPlayers(gameId)

    alertProposition(gameId, {
        proposablePlayers,
        proposition: {
            propositionId,
            authorVillager: id, 
            proposedVillager,
            nbVotes,
            usernameAuthor,
            usernameProposed
        }
    })
}


const handlePowerUse = (ws, { gameId, userId, powerType, args}) => {
    // and we call the method to use the power in the powerController
    powerController.usePower(gameId, userId, powerType, args)
}


const sendGameParameters = async (ws, gameId) => {
    const parameters = await gameController.getAllGameParameters(gameId)

    ws.send(
        createMessage('gameSettings', parameters)
    )
}


const sendParkMessage = (gameId, data) => {
    // get all the villagers in the game, and send the message
    villagerController.getVillagersInGame(gameId)
        .then(villagers => {
            wsServer.clients.forEach(client => {
                // get only the clients that are in the game
                if (villagers.includes(parseInt(client.userId))) {
                    client.send(
                        createMessage('parkMessage', data)
                    )
                }
            })
        })
}


const sendWerewolfMessage = (gameId, data) => {
    // gets all the werewolves and dead villagers in the game
    villagerController.getWerewolfAndDeadInGame(gameId)
        .then(villagers => {
            wsServer.clients.forEach(client => {
                // get only the clients that are in the game
                if (villagers.includes(parseInt(client.userId))) {
                    client.send(
                        createMessage('werewolfMessage', data)
                    )
                }
            })

        })
}


const sendPlayers = async (ws, matchId) => {
    gameController.getPlayers(matchId)
        .then(players => {
            // after getting the players, send to everyone that is connected to this particular game
            wsServer.clients.forEach(client => {
                // make sure to only send to the ones that are on the game
                if (client.matchId == matchId)
                    client.send(
                        createMessage('playersList', players)
                    )
            });
        })
        .catch(e => {
            console.log("Error sending players")
        })
}


const sendPowerMessage = (gameId, userId, success, powerType, data) => {
    wsServer.clients.forEach(client => {
        if(client.matchId == gameId && client.userId == userId)
            client.send(
                createMessage('power', {
                    success,
                    powerType,
                    data
                })
            )
    })
}


const sendRoleChange = (gameId, targetUserId, newRole) => {
    wsServer.clients.forEach(client => {
        if(client.matchId == gameId && client.userId == targetUserId)
            client.send(
                createMessage('roleChange', {
                    newRole
                })
            )
    })
}


const alertGameStart = async (gameId, players, rolesAndPowers) => {
    // for every client in the game, indicate that the match is starting

    wsServer.clients.forEach(client => {
        // make sure to only send to the ones that are on the game
        if (client.matchId == gameId) {
            // get the villager role and power
            const { isWerewolf, hasPower, powerType } = rolesAndPowers.find(user => user.id == client.userId)

            // update into the ws as well
            client.isWerewolf = isWerewolf
            client.hasPower = hasPower
            client.powerType = powerType

            client.send(
                createMessage('gameStart', { players, isWerewolf, hasPower, powerType })
            )
        }
    });
}


const alertNightDayChange = async (gameId, dayTimeType) => {
    // we also send the proposable players, if it is night, only werewolves can propose and vote
    const dayTime = await gameController.getDayTime(gameId)
    const proposablePlayers = await propositionController.getNotProposedPlayers(gameId)

    // alert every alive villager of the day/night shift
    // we don't alert the dead villagers as they don't archive their messages
    villagerController.getAliveVillagers(gameId)
        .then(aliveVillagers => {
            wsServer.clients.forEach(client => {
                if (aliveVillagers.includes(parseInt(client.userId)) && ((dayTime == 'night' && client.isWerewolf) || dayTime == 'day')) {
                        client.send(
                            createMessage(dayTimeType, {proposablePlayers})
                        )
                }
                else {
                    client.send(
                        createMessage(dayTimeType, {proposablePlayers: []})
                    )
                }
            })
        })
}

const alertProposition = async (gameId, propositionData) => {
    // send taking into account if it is a werewolf or human proposition
    // it will be done knowing whether it is day or night
    const dayTime = await gameController.getDayTime(gameId)

    wsServer.clients.forEach(client => {
        if (client.matchId == gameId &&
            // if it is night, send only to the werewolves
            ((dayTime == 'night' && client.isWerewolf) || dayTime == 'day')
        ) {
            client.send(
                createMessage('proposition', propositionData)
            )
        }
    })
}

const alertRatification = async (gameId, proposedVillager) => {
    // get the associated userId for the killed villager
    const userId = await villagerController.getAssociatedUserId(proposedVillager)
    
    // everyone in the game is going to be notified of the ratification
    wsServer.clients.forEach(client => {
        if (client.matchId == gameId) {
            client.send(
                // and the proposable players are now null, as there is no more possibilities to vote
                createMessage('ratification', { proposablePlayers: [], killedVillager: userId })
            )
        }
    })
}


const alertGameEnd = (gameId, winner, messages) => {
    // when the game ends, we send the alert to all players in the game
    wsServer.clients.forEach(client => {
        if (client.matchId == gameId) {
            client.send(
                createMessage('gameEnd', {
                    winner,
                    messages
                })
            )
        }
    })

}


exports.alertGameStart = alertGameStart
exports.alertNightDayChange = alertNightDayChange
exports.alertRatification = alertRatification
exports.alertGameEnd = alertGameEnd
exports.sendPowerMessage = sendPowerMessage
exports.sendRoleChange = sendRoleChange

module.exports = {
    initWebsocket,
    alertGameStart,
    alertNightDayChange,
    alertRatification,
    alertGameEnd,
    sendPowerMessage,
    sendRoleChange
}