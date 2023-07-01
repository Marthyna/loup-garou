const has = require('has-keys')

const verifyHeader = (headers) => {

    // verify if we have headers and the acces token
    if ( !headers || 
         !Object.prototype.hasOwnProperty.call(headers, 'x-access-token')
       ) 
    { 
        throw new CodeError('Token missing', 403) 
    }

}

const verifyDataHeader = (req) => {
    if (!has(req.body, ['data']))
        throw new CodeError('You must specify the data field', 401)
}


module.exports = {
    verifyHeader,
    verifyDataHeader
}