const jws = require('jws')
const CodeError = require('../CodeError')
require('mandatoryenv').load(['TOKENSECRET'])

const { TOKENSECRET } = process.env

const generateToken = (payload) => {
    // create the token using HS256
    return jws.sign({
        header: { alg: 'HS256' },
        payload,
        secret: TOKENSECRET
    })
}

const verifyToken = (token) => {

    // first we test if the token exists
    if(token == null)
        // 401 error code (user not identified)
        throw new CodeError("token can't be null", 401)

    // we verify the token is valid
    if(!jws.verify(token, 'HS256', TOKENSECRET)) 
        throw new CodeError("Invalid token", 403)

} 

const decodeToken = (token) => {
    return jws.decode(token).payload
}

const userTokenMatch = (user, tokenUser) => {
    if(user !== tokenUser)
        // if they don't, send 403 status (forbidden)
        throw new CodeError('Token and user do not match', 403)
}


module.exports = {
    generateToken,
    verifyToken,
    decodeToken,
    userTokenMatch
}