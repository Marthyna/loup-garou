import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';
let BACKEND_URL = 'http://IP_BACKEND:3000';
if ( isWeb ){
    BACKEND_URL = 'http://localhost:3000' ;
}

const WS_BACKEND = `ws://localhost:8080`

export default {
    WS_BACKEND,
    BACKEND_URL,
  };