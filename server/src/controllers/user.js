const userModel = require('../models/users')
const gameModel = require('../models/game')

// utils
const headers = require('../util/validation/headers.js')
const tokenValidator = require('../util/validation/token.js')
const jsonParser = require('../util/parsing/jsonParser.js')


const verifyUser = async (req, res, next) => {
    // test if headers are ok
    headers.verifyHeader(req.headers);
    
    const token = req.headers['x-access-token']
    // test validity of the token
    tokenValidator.verifyToken(token)
    
    // if valid decode the token if 
    req.payload = tokenValidator.decodeToken(token)
    
    if (req.params.user) {
        // check if it the user and token corresponds
        tokenValidator.userTokenMatch(req.params.user, req.payload)
        
        // retrieve the user id if everything is alright
        req.userID = await userModel.findOne({ 
            attributes: ['id', 'name', 'token'], 
            where: { 
                token: req.headers['x-access-token'] 
            } 
        })
        .then(data => data.id)
    }

    next()
}


const getUsername = async (id) => {
    const {username} = await  userModel.findOne({
        attributes: ["username"],
        where: {id}
    })

    return username
}


const getUser = async (id) => {
    // retrives only one user
    const data = await userModel.findByPk(id)

    return data;
}

const getUsers = async (req, res) => {
    // gets the id and name of all users
    const data = await userModel.findAll({ 
        attributes: ['id', 'username', 'password', 'token'] 
    })
    // transform it to json
    res.json({ status: true, message: 'Returning users', data })
}

const registerUser = async (req, res) => {
    // make sure you have the data field
    headers.verifyDataHeader(req)

    // parse the data
    const {username, password} = jsonParser.getCredentials(req)

    // check if user already exists in the database
    const newUser = await isNewUser(username)

    // if it already exists, send error code
    if(!newUser) { 
        res.sendStatus(401)
        return;
    }

    // create the token for this new user
    const token = tokenValidator.generateToken(username)

    // create the new user
    createNewUser(username, password, token)

    // if everything goes well, send positive response
    res.sendStatus(200)
}

const authenticateUser = async (req, res) => {
    // make sure you have the data field
    headers.verifyDataHeader(req)

    // get the data in the request
    const {username, password} = jsonParser.getCredentials(req)

    // check if the credentials match
    const valid = await performAuthentication(username, password)

    if(valid) {
        // if the user is valid, we send the id and token for their use
        const {id, token} = valid        
        res.json({
            status: 200,
            id: id,
            token: token            
        })
    }
    else
        res.json({
            status: 403
        })

}

const createNewUser = async (username, password, token) => {
    // create user in the model
    await userModel.create({ username, password, token })
}

const performAuthentication = async (username, password) => {
    // make the query to find the match
    const user = await userModel.findOne({
        attributes: ["id", "token"],
        where: {username, password}
    })

    if(!user)
        return null

    // if the user exists and can be validated, retrieve the id and token
    const {id, token} = user

    // and return them
    return {id, token}
}

const isNewUser = async (username) => {
    // check if user is not already in the database
    const userExistence = await userModel.findOne({ where: { username } })

    if (userExistence) {
        return false
    }
    return true
}

const associateGame = async (user_id, match_id) => {
    // verify the existence of the match and the user
    const user  = await userModel.findByPk(user_id)
    const match = await gameModel.findByPk(match_id)


    if(!user || !match)
        return false

    await user.addGame(match);
    
    return true;
}

const dissociateGame = async (user_id, match_id) => {
    // verify the existence of the match and the user
    const user  = await userModel.findByPk(user_id)
    const match = await gameModel.findByPk(match_id)

    if(!user || !match)
        return false
    
    await user.removeGame(match)

    return true
}


module.exports = {
    getUser,
    getUsername,
    getUsers,
    verifyUser,
    registerUser,
    authenticateUser,
    associateGame,
    dissociateGame
}
