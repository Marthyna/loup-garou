import { getUserId, getToken, getGameId } from "./internalStorage";
import config from "../config"

const WS_BACKEND = config.WS_BACKEND

let setSettings;
let setPlayers;
let setParkMessages;
let setWerewolfMessages;
let setPropositions;
let setAlivePlayers
let setDayTime;
let setRole;
let navigation;
let ws;


const updateSetSettings = (fn) => {
    setSettings = fn
}

const updateSetPlayers = (fn) => {
    setPlayers = fn
}

const updateSetParkMessages = (fn) => {
    setParkMessages = fn
}

const updateSetWerewolfMessages = (fn) => {
    setWerewolfMessages = fn
}

const updateSetPropositions = (fn) => {
    setPropositions = fn
}

const setNavigation = (nav) => {
    navigation = nav
}

const updateSetAlivePlayers = (fn) => {
    setAlivePlayers = fn
}

const updateSetDayTime = (fn) => {
    setDayTime = fn
}

const updateSetRole = (fn) => {
    setRole = fn
}

const createMessage = (messageType, data) => {
    return JSON.stringify({
        messageType,
        data
    })
}



const connect = async (gameId) => {
    ws = new WebSocket(`${WS_BACKEND}/id=${gameId}`);

    const userId = await getUserId()
    const token = await getToken()


    ws.onerror = (e) => {
        // An error occurred
        console.log("ERROR", e.message);
    };

    ws.onclose = (e) => {
        // Connection closed
        console.log("close", e.code, e.reason);
    };

    ws.onopen = () => {
        // Connection opened
        console.log('WebSocket connection opened');

        // send the message containing who joined the match
        const message = {
            messageType: 'lobbyInit',
            data: {
                token,
                userId,
                matchId: gameId
            }
        }
        ws.send(JSON.stringify(message))
    };

    ws.onmessage = (e) => {
        // Receive a message from the server
        try {
            const {type, data} = JSON.parse(e.data)

            switch(type) {
                case 'playersList':
                    setPlayers(data)
                    break;
                case 'validation':
                    const {valid} = data
                    if(!valid) {
                        alert("NOT A VALID MATCH")
                        navigation.navigate("Home")
                    }
                    break;
                case 'gameSettings':
                    setSettings(data)
                    break;
                case 'gameStart':
                    console.log("STARTING GAME!");
                    // and indicate the villager's role and power (if any)
                    navigation.navigate("Game", data)
                    break;
                case 'parkMessage':
                    console.log("UPDATING PARK CHAT");
                    setParkMessages(messages => [...messages, data])
                    break;
                case 'werewolfMessage':
                    console.log("UPDATING WEREWOLF CHAT");
                    setWerewolfMessages(messages => [...messages, data])
                    break;
                case 'dayTime':
                    console.log("IT IS DAY TIMEEE!");
                    setDayTime('day')
                    setAlivePlayers(data.proposablePlayers)
                    setWerewolfMessages([])
                    setPropositions([])
                    break;
                case 'nightTime':
                    console.log("IT IS NIGHT TIMEE!")
                    setDayTime('night')
                    setAlivePlayers(data.proposablePlayers)
                    setParkMessages([])
                    setPropositions([])
                    break;
                case 'voteFail':
                    alert('Your vote failed!')
                    break;
                case 'proposition':
                    console.log("PROPOSITION!");
                    setAlivePlayers(data.proposablePlayers)
                    setPropositions(propositions => [...propositions, data.proposition])
                    break;
                case 'ratification':
                    console.log("RATIFICATION!", data.proposablePlayers);
                    // set the players that are still alive
                    setAlivePlayers(data.proposablePlayers)
                    if(userId == data.killedVillager) {
                        setRole('dead')
                        alert('You were killed!')
                    }
                    setPropositions([])
                    break;
                case 'gameEnd':
                    alert(`Game ended and the winners are the ${data.winner}`)
                    setAlivePlayers([])
                    setPropositions([])
                    setParkMessages(data.messages.parkMessages)
                    setWerewolfMessages(data.messages.werewolfMessages)
                    break;
                case 'roleChange':
                    console.log("CHANGING ROLE!", data.newRole);
                    alert(`You were transformed into a ${data.newRole}`)
                    setRole(data.newRole)
                    break;
                case 'power':
                    console.log("USED POWER!")
                    if(!data.success)
                        alert("You were not allowerd to use the power")
                    break;
            }
        }
        catch {
            console.log("onmessage", e.data);
        }
    };

    ws.onclose = () => {
        console.log("closing websocket connection");
    }
}

const disconnect = async (matchId) => {
    // if there was a connection to websocket, make sure to disconnect
    if(ws) {
        const userId = await getUserId()
        const token = await getToken()
        
        // send message containing the logout notification
        const message = {
            messageType: 'lobbyLogout',
            data: {
                token,
                userId,
                matchId
            }
        }
        ws.send(JSON.stringify(message))
    
        ws.close()
    }
}


const createProposition = (token, gameId, userId, proposedVillager) => {
    
    ws.send(
        createMessage('proposition', {
            token,
            gameId,
            userId,
            proposedUserId: proposedVillager
        })
    )
}


const voteProposition = (token, gameId, userId, propositionId) => {
    ws.send(
        createMessage('vote', {
            token,
            gameId,
            userId,
            propositionId
        })
    )
}


const sendGroupMessage = (chatType, token, userId, gameId, messageContent) => {
    ws.send(
        createMessage('groupMessage', {
            token,
            gameId,
            userId,
            chatType,
            messageContent
        })
    )
}


const getAlivePlayers = ({token, gameId}) => {
    ws.send(
        createMessage('getPlayers', {
            gameId
        })
    )
}


const sendUsePower = (gameId, userId, powerType, args) => {
    ws.send(
        createMessage('power', {
        gameId,
        userId, 
        powerType,
        args
        })
    )
}



export {
    connect,
    getAlivePlayers,
    disconnect,
    sendGroupMessage,
    updateSetDayTime,
    updateSetAlivePlayers,
    updateSetPropositions,
    updateSetSettings,
    updateSetPlayers,
    updateSetParkMessages,
    updateSetWerewolfMessages,
    updateSetRole,
    setNavigation,
    voteProposition,
    createProposition,
    sendUsePower
}


