// controllers
const gameController = require('./match')
const villagerController = require('./villager')
const wsController = require('./websocket')

// models
const villagerModel = require('../models/villager')

const { Powers } = require("../util/powerTypes")
const { checkGameEnded } = require('./match')
const headers = require('../util/validation/headers')
const jsonParser = require('../util/parsing/jsonParser')
const { getUsername } = require('./user')


const setUsedPower = async (villagerId, value) => {
    // set if the power was used or not
    await villagerModel.update(
        {usedPower: value},
        {
            where: {
                id: villagerId    
            }
        }
    )
}

const getUsedPower = async (villagerId) => {
    // retrieve if the power was used or not in this round
    const {usedPower} = await villagerModel.findByPk(villagerId)
    return usedPower
}


const checkUsability = async (powerType, args) => {    
    const { villagerWithPower } = args
    
    const isNight = (await gameController.getDayTime(gameId)) == 'night' ? true : false
    const isAlive = await villagerController.getIsAlive(villagerWithPower)
    const usedPower = await getUsedPower(villagerWithPower)
    
    // in all cases, the one using the power must be alive, it must be night and have not used the power yet
    if(!isAlive || !isNight || usedPower)
        return false

    switch (powerType) {
        case Powers.Contamination:
            return (await checkContaminationUsability(args))
        case Powers.Clairvoyance:
            return true;
        case Powers.Insomnia:
            return (await checkInsomniaUsability(args));
        case Powers.Psychic:
            return (await checkPsychicUsability(args))
    }
}


const checkInsomniaUsability = async ({villagerWithPower}) => {
    // the villager using the power must be a human
    const isHuman = await villagerController.getIsHuman(villagerWithPower)

    if(!isHuman)
        return false
    return true
}


const checkContaminationUsability = async ({villagerWithPower, targetVillager}) => {
    const isWerewolf = await villagerController.getIsWerewolf(villagerWithPower)
    const isAlive = await villagerController.getIsAlive(targetVillager)
    const isHuman = await villagerController.getIsHuman(targetVillager)

    // the one who uses the power must be a werewolf
    // the targeted villager must be alive and a human
    if(!isWerewolf || !(isAlive && isHuman))
        return false
    return true
}


const checkPsychicUsability = async ({targetVillager}) => {
    // a target villager must be passed in parameter

    // check if it is an alive villager or not
    const isAliveVillager = await villagerController.getIsAlive(targetVillager)

    // the psychic power can only be used at night and on dead villagers
    if(isAliveVillager) 
        return false
    return true
}


const usePower = async (gameId, userId, powerType, args) => {
    // check if the power can be used

    // get the villager associated with the userId
    const villagerWithPower = (await villagerController.getVillagerByUser(userId)).id

    const canUse = await checkUsability(powerType, {villagerWithPower, ...args})
    if(!canUse) {
        return false
    }

    // call the right power implementation
    switch (powerType) {
        case Powers.Contamination:
            useContamination(gameId, userId, args)
            break;
        case Powers.Clairvoyance:
            useClairvoyance(gameId, userId, args)
            break;
        case Powers.Insomnia:
            useInsomnia(gameId, userId)
            break;
        case Powers.Psychic:
            usePsychic(gameId, userId, args)
            break;
    }

    // and indicate the power was used
    setUsedPower(villagerWithPower, true)
}


const useContamination = async (gameId, userId, {targetVillager}) => {
    // we turn the human into a werewolf
    await villagerModel.update(
        {isWerewolf: true},
        {
            where: { 
                id: targetVillager,
                gameId
            }
        }
    )
    // indicate to the user that the power was used with success
    wsController.sendPowerMessage(gameId, userId, true, Powers.Contamination, null)
    
    const targetUserId = await villagerController.getAssociatedUserId(targetVillager)
    // indicate to the new werewolf that his role has changed
    wsController.sendRoleChange(gameId, targetUserId, 'werewolf')

    // by doing that, we can maybe transform the last human into werewolf ending the game
    checkGameEnded(gameId)
}


const useClairvoyance = async (gameId, userId, {targetVillager}) => {
    // get the role and the power of the target villager
    const {isWerewolf, hasPower, powerType} = await villagerModel.findByPk(targetVillager)

    // and then we send it to the user that used the power
    wsController.sendPowerMessage(gameId, userId, true, Powers.Clairvoyance, {isWerewolf, hasPower, powerType})
}


const useInsomnia = (gameId, userId) => {
    // we only need to indicate in the db that the power was used   
    // indicate to the user that the power was used with success
    wsController.sendPowerMessage(gameId, userId, true, Powers.Insomnia, null)
}


const usePsychic = (gameId, userId, args) => {
    // indicate to the user that the power was used with success
    wsController.sendPowerMessage(gameId, userId, true, Powers.Psychic, null)
}


const getTargetPlayers = async (req, res) => {
    // verify we have the data header
    headers.verifyDataHeader(req)

    const {powerType, gameId} = jsonParser.getPowerParams(req)

    // type: {villagerId, userId, username}
    if(powerType == Powers.Clairvoyance) {
        // return all alive villagers
        const usersIds = await villagerController.getAliveVillagers(gameId)
        // for each one, retrieve the username and villagerId
        const villagers = []
        for(user of usersIds) {
            const username = await getUsername(user);
            const {id} = await villagerController.getVillagerByUser(user)
            villagers.push({
                userId: user,
                username,
                villagerId: id
            })
        }
        res.json({villagers})
    }
    else if(powerType == Powers.Contamination) {
        // send only the alive humans
        const villagersId = await villagerController.getAliveHumans(gameId)
        const villagers = []
        for(vil of villagersId) {
            const user = await villagerController.getAssociatedUserId(vil)
            const username = await getUsername(user)

            villagers.push({
                userId: user,
                username,
                villagerId: vil
            })
        }
        res.json({villagers})
    }
    else if(powerType == Powers.Psychic) {
        // send only the dead villagers
        const deadVillagersId = await villagerController.getDeadVillagers(gameId)

        const villagers = []
        for(vil of deadVillagersId) {
            const user = await villagerController.getAssociatedUserId(vil)
            const username = await getUsername(user)

           villagers.push({
                userId: user,
                username,
                villagerId: vil
            })
        }
        res.json({villagers})
    }
}


const resetAllPowers = async (gameId, value) => {
    // we set all powers usability to the value in parameter
    await villagerModel.update(
        {usedPower: value},
        {  
            where: {
                gameId,
                // we only look at those that have a power
                hasPower: true
            }
        }
    )
}



module.exports = {
    usePower,
    setUsedPower,
    getUsedPower,
    getTargetPlayers,
    resetAllPowers
}


