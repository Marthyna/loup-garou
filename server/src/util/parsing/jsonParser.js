const has = require('has-keys')

const getCredentials = (req) => {
    const parsedData = parseDataReq(req)

    // check if data has field name
    if (!has(parsedData, ['username']))
        throw new CodeError('You must specify the name field', 401)
    
    if (!has(parsedData, ['password']))
        throw new CodeError('You must specify the password field', 401)
    
    const { username, password } = parsedData

    return {username, password}
}

const parseDataReq = (req) => {
    // you must have the data field
    if (!has(req.body, ['data'])) 
        throw new CodeError('You must specify the data field', 401)
    
    const { data } = req.body
    return JSON.parse(data)
}

const getParameters = (req) => {
    const parsedData = parseDataReq(req)

    // check if all the fields exist data has field name
    if (
            !has(parsedData, ["name"])                          ||
            !has(parsedData, ["minNbParticipants"])             ||
            !has(parsedData, ["maxNbParticipants"])             ||
            !has(parsedData, ["dayDuration"])                 ||
            !has(parsedData, ["nightDuration"])                 ||
            !has(parsedData, ["dayDuration"])                 ||
            !has(parsedData, ["startDate"])                     ||    
            !has(parsedData, ["werewolfProp"])                  ||
            !has(parsedData, ["contaminationProb"])             ||
            !has(parsedData, ["insomniaProb"])                  ||
            !has(parsedData, ["clairvoyanceProb"])              ||
            !has(parsedData, ["psychicProb"])                 
    )
        throw new CodeError('You must specify all the parameter fields', 401)

    // if all the parameters exists, return the parsed object
    const { 
        name,
        minNbParticipants,
        maxNbParticipants,
        nightDuration,
        dayDuration,
        startDate,
        werewolfProp,
        contaminationProb,
        insomniaProb,
        clairvoyanceProb,
        psychicProb
    } = parsedData

    return {
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
    }
}


const getPowerParams = (req) => {
    const parsedData = parseDataReq(req)

    if (
        !has(parsedData, ["powerType"])               ||
        !has(parsedData, ["gameId"])                 
    )
        throw new CodeError('You must specify powerType and gameId fields', 401)

    const {powerType, gameId} = parsedData

    return {powerType, gameId}
}




module.exports = {
    getCredentials,
    getParameters,
    getPowerParams
}