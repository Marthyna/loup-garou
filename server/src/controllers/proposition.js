// models
const propositionModel = require('../models/proposition')
const gameModel = require('../models/game')

// controllers
const villagerController = require('./villager')
const gameController = require('./match')
const wsController = require('./websocket')
const userController = require('./user')

const createProposition = async (gameId, authorVillager, proposedVillager) => {
    // get the game
    gameId = parseInt(gameId)
    const game = await gameModel.findByPk(gameId)

    // create the model
    const proposition = await propositionModel.create({
        authorVillager,
        proposedVillager,
        // we always start a proposition with 1 vote
        // that is, the one who proposed vote for this
        nbVotes: 1
    })

    // update the author villager vote status, so that he can't vote anymore
    await villagerController.updateVoteStatus(authorVillager, false)

    // associate the proposition to the game
    await game.addProposition(proposition)

    // in a situation where there is only 2 players, we need to check the ratification already in the creation
    const ratified = await checkRatification(gameId, proposition.id, 1)
    // if ratified, alert the proposition creation function
    if(ratified)
        return false;
    
    const { id } = proposition
    return {
        propositionId: id, 
        proposedVillager, 
        nbVotes: 1
    }
}


const deleteAllGameProposition = (gameId) => {
    // destroy all propositions
    propositionModel.destroy({
        where: { gameId }
    })
}


const incrementVote = async (gameId, propositionId, villagerId) => {
    // increment the number of votes in the proposition
    gameId = parseInt(gameId)

    // increment the value of nbVotes by 1
    const proposition = await propositionModel.findByPk(propositionId)
    let {nbVotes} = await proposition.increment('nbVotes', {by: 1})
    // the value returned is before the increment
    nbVotes+=1;

    // indicate the user already voted for this round
    await villagerController.updateVoteStatus(villagerId, false)

    return nbVotes
}


const getNbVotesToValidate = async (gameId) => {
    // the number of votes to validate is equal to half of the players that can vote
    const dayTime = await gameController.getDayTime(gameId)
    
    if(dayTime == 'night') {
        // get the number of werewolves that are alive
        const aliveWerewolves = await villagerController.getAliveWerewolves(gameId)
        return Math.ceil(aliveWerewolves.length / 2)
    }
    else {
        // get the number of alive players
        const players = await villagerController.getAliveVillagers(gameId)
        return Math.ceil(players.length / 2)
    }
}


const checkRatification = async (gameId, propositionId, nbVotes) => {
    const nbVotesToValidate = await getNbVotesToValidate(gameId)

    // if there is enough votes to validate
    if( nbVotes >= nbVotesToValidate ) {
        // get the proposed villager
        const { proposedVillager } = await propositionModel.findOne({
            attributes: ["proposedVillager"],
            where: {
                id: propositionId
            }
        })

        // we kill the villager associated
        villagerController.killVillager(gameId, proposedVillager)

        // we delete all the propositions
        deleteAllGameProposition(gameId)

        // check if game ended, and if so, perform the needed actions
        const isGameEnded = await gameController.checkGameEnded(gameId)
        
        // if the game is not ended, we alert the players of the ratification
        if(!isGameEnded) {
            wsController.alertRatification(gameId, proposedVillager)
        }
        return true;
    }
    return false;
}


const villagerVote = async (gameId, propositionId, villagerId) => {
    // check if the villager can in fact vote in this round
    const canVillagerVote = await villagerController.checkVoteStatus(villagerId)

    if(canVillagerVote) {
        // increment the vote count
        const nbVotes = await incrementVote(gameId, propositionId, villagerId)

        // check if a villager should be killed
        await checkRatification(gameId, propositionId, nbVotes)

        return true
    }
    return false
}


const getNotProposedPlayers = async (gameId) => {
    // we get all the villagers that were proposed
    const proposedVillagers = await propositionModel.findAll({
        attributes: ["proposedVillager"],
        where: {
            gameId
        }
    })

    const villagersId = []
    for( vil of proposedVillagers ) {
        villagersId.push(await villagerController.getAssociatedUserId(vil.proposedVillager))
    }

    // and we get all villagers in the game
    const aliveVillagers = await villagerController.getAliveVillagers(gameId)

    const notProposedUsers = aliveVillagers.filter(el => !villagersId.includes(el))

    // lastly, we need to get the username of the players
    const notProposed = []
    for(vil of notProposedUsers) {
        notProposed.push({id:vil, username: await userController.getUsername(vil)})
    }

    return notProposed
}


module.exports = {
    createProposition,
    deleteAllGameProposition,
    incrementVote,
    villagerVote,
    getNotProposedPlayers
}