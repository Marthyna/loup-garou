import { getToken } from './internalStorage'

const postHeader = {
    'cache-control': 'no-cache',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
}

const createBody = (data) => {
    const body = new URLSearchParams()
    body.append('data', JSON.stringify(data))
    
    return body
}

const getAuthenticationHeader = async () => {
    const token = await getToken()
    return {
        'x-access-token': token
    }
}

export {
    postHeader,
    createBody,
    getAuthenticationHeader
}


