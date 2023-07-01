// models
const groupMessageModel = require('../models/groupMessage')
const gameModel = require('../models/game')
const villagerModel = require('../models/villager')

// controllers
const villagerController = require('./villager')
const gameController = require('./match')

const { ChatType } = require('../util/chatType')


const createMessage = async ({userId, gameId, messageContent, messageType, timeStamp}) => {
    // retrieve the villager and game
    const game = await gameModel.findByPk(gameId)
    const villager = await villagerController.getVillagerByUser(userId)

    // create the base message
    const message = await groupMessageModel.create({
        messageContent,
        messageType,
        // by default, the message is not archived
        archived: false,
        timeStamp
    })

    // and associate it to the villager and the game
    game.addGroupMessage(message)
    villager.addGroupMessage(message)
}


const archiveMessages = (gameId, chatType) => {
    // update the archived parameter to true
    // for all the game messages of the given type
    groupMessageModel.update(
        { archived: true },
        {
            where: { gameId, messageType: chatType }
        }
    )
}


const getAllMessages = async (gameId) => {
    // retrieve only the park messages
    const parkMessages = await groupMessageModel.findAll({
        where: {
            gameId,
            messageType: ChatType.Park
        }
    })

    // retrieve only the park messages
    const werewolfMessages = await groupMessageModel.findAll({
        where: {
            gameId,
            messageType: ChatType.Werewolf
        }
    })

    return {parkMessages, werewolfMessages}
}


const checkCanSendMessage = async (gameId, userId, chatType) => {
    const villagerId = (await villagerController.getVillagerByUser(userId)).id
    const isAlive = await villagerController.getIsAlive(villagerId)
    
    // messages on group can only be sent by alive villagers
    if(chatType == ChatType.Park || chatType == ChatType.Werewolf) {
        if(!isAlive)
            return false
    }

    // if that is ok, we check the other constraints
    const dayTime = await gameController.getDayTime(gameId)


    // if the chatType is the park one, we can send messages only at day
    if(chatType == ChatType.Park && dayTime == 'night') {
        return false
    }
    
    // and messages on the werewolf chat can only be sent at night
    // and additionally, only werewolves can send it
    const isWerewolf = await villagerController.getIsWerewolf(villagerId)

    if( chatType == ChatType.Werewolf && (dayTime == 'day' || !isWerewolf) ) {
        return false
    }

    // if everything is okay, return true
    return true
}





module.exports = {
    getAllMessages,
    createMessage,
    archiveMessages,
    checkCanSendMessage
}