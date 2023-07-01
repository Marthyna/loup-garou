import AsyncStorage from "@react-native-async-storage/async-storage"

const tokenKey = '@token'
const userIdKey = '@user_id'
const gameIdKey = '@game_id'

const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
        return true
    }
    catch {
        return false
    }
}

const getStoredItem = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if(value !== null) {
          return value
        }
      } catch(e) {
        // error reading value
        return null
      }
}

const getStoredObject = async (key, value) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch(e) {
        // error reading value
        return null
      }
}

const setUserInfo = async (userId, token) => {   
    if(setUserId(userId) && setToken(token))
        return true
    return false    
}

const setUserId = async (userId) => {
    return await storeData(userIdKey, userId)
}

const getUserId = async () => {
    return await getStoredItem(userIdKey)
}

const setToken = async (token) => {
    return await storeData(tokenKey, token)
}

const getToken = async () => {
    const token = await getStoredItem(tokenKey)
    return token
}

const setGameId = async (gameId) => {
    return await storeData(gameIdKey, gameId)
}

const getGameId = async (gameId) => {
    return await getStoredItem(gameIdKey)
}

export {
    setUserInfo,
    getUserId,    
    getToken,
    setGameId,
    getGameId
}