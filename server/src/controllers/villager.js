// models
const userModel = require('../models/users')
const gameModel = require('../models/game')
const villagerModel = require('../models/villager')

// controllers
const userController = require('./user')
const gameController = require('./match')

const createVillager = async (userId, gameId, isWerewolf, hasPower, powerType) => {
    // we find the user and game object
    const user = await userModel.findByPk(userId)
    const game = await gameModel.findByPk(gameId)


    // then we create the associated villager
    const villager = await villagerModel.create({
        // we initialize all the villagers to alive
        isAlive: true,
        canVote: true,
        isWerewolf,
        hasPower,
        powerType,
        // by default, no power is used
        usedPower: false
    })

    // and associate them
    user.setVillager(villager)
    game.addVillager(villager)
}


const killVillager = async (gameId, villagerId) => {
    // we update the villager isAlive attribute
    villagerModel.update(
        { isAlive: false },
        {
            where: {
                id: villagerId,
                gameId
            }
        }
    )
}


const getAssociatedUserId = async (villagerId) => {
    // get the associated user
    const villager = await villagerModel.findByPk(villagerId)

    const { id } = await villager.getUser({
        attributes: ["id"]
    })

    return id
}


const deleteVillager = async (userId) => {
    const user = await userModel.findByPk(userId);
    const villager = await user.getVillager();

    await user.removeVillager(villager);
}


const  getVillagersInGame = async (gameId) => {
    const villagers = await villagerModel.findAll({
        raw: true,
        nest: true,
        attributes: ["userId"],
        where: {
            gameId
        }
    })

    // get only the data
    return villagers.map(obj => obj.userId)
}


const getWerewolfAndDeadInGame = async (gameId) => {
    const villagers = await villagerModel.findAll({
        raw: true,
        nest: true,
        attributes: ["userId"],
        where: {
            // we only need to mention the werewolf property
            // the isAlive property is irrelevant in this query
            isWerewolf: true,
            gameId
        }
    })

    // get only the data
    return villagers.map(obj => obj.userId)
}


const getAliveVillagers = async (gameId) => {
    const villagers = await villagerModel.findAll({
        raw: true,
        nest: true,
        attributes: ["userId"],
        where: {
            isAlive: true,
            gameId
        }
    })

    // get only the data
    return villagers.map(obj => obj.userId)
}


const getVillagerByUser = async (userId) => {
    return await villagerModel.findOne({
        where: {
            userId
        }
    })
}


const updateVoteStatus = async (villagerId, canVote) => {
    // update the vote status to the one in the parameter
    await villagerModel.update(
        { canVote },
        {
            where: { id: villagerId }
        }
    )
}


const checkVoteStatus = async (villagerId) => {
    // check if the villager can vote
    const {isAlive, canVote} = await villagerModel.findOne({
        attributes: ["isAlive", "canVote"],
        where: {
            id: villagerId
        }
    })

    // the condition to vote is being alive and not having voted this round
    if(isAlive && canVote)
        return true
    return false
}


const getAliveWerewolves = async (gameId) => {
    const werewolves = await villagerModel.findAll({
        attributes: ["id"],
        where: {
            gameId,
            isAlive: true,
            isWerewolf: true
        }
    })

    return werewolves.map(el => el.id)
}


const getAliveHumans = async (gameId) => {
    const humans = await villagerModel.findAll({
        attributes: ["id"],
        where: {
            gameId,
            isAlive: true,
            isWerewolf: false
        }
    })

    return humans.map(el => el.id)
}


const getDeadVillagers = async (gameId) => {
    const deadVillagers = await villagerModel.findAll({
        attributes: ["id"],
        where: {
            gameId,
            isAlive: false
        }
    })

    return deadVillagers.map(el => el.id)
}


const getIsWerewolf = async (villagerId) => {
    const {isWerewolf} = await villagerModel.findByPk(villagerId)
    return isWerewolf
}


const getIsAlive = async (villagerId) => {
    const {isAlive} = await villagerModel.findByPk(villagerId)
    return isAlive
}


const getIsHuman = async (villagerId) => {
    const {isWerewolf} = await villagerModel.findByPk(villagerId)
    return !isWerewolf
}


module.exports = {
    getAliveVillagers,
    createVillager,
    killVillager,
    deleteVillager,
    getVillagerByUser,
    getVillagersInGame,
    getWerewolfAndDeadInGame,
    updateVoteStatus,
    getAssociatedUserId,
    checkVoteStatus,
    getAliveHumans,
    getAliveWerewolves,
    getDeadVillagers,
    getIsWerewolf,
    getIsAlive,
    getIsHuman
}