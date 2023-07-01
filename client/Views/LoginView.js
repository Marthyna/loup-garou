import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HStack, Flex } from '@react-native-material/core';
import { createBody } from '../utils/requests.js';
import { setUserInfo } from '../utils/internalStorage.js';
import { ImageBackground } from 'react-native';
import LoginForm from "../components/LoginForm.js";


import config from '../config.js';
const BACKEND = config.BACKEND_URL;
const backgroundImage = require('../images/loupgarou.jpg');
const CustomButton = ({ testID, style, ...props }) => (
    <Button
      {...props}
      testID={testID}
      
    />
  );



export default function LoginView({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    
    


    // function responsible for the login requests
    function login(username, password) {

        // create the body element
        const data = {
            username,
            password
        }
        const body = createBody(data)

        // make the request
        fetch(`${BACKEND}/user/authenticate/`, {
            method: 'POST',
            body
        })
            .then(response => response.json())
            .then(response => {
                if (response.status != 200) {
                    alert("not valid username or password")
                }
                else {
                    const { id, token } = response
                    setUserInfo(id, token)
                    navigation.navigate("Home")
                }
            })
            // .then(data => {if (data.token) {setToken(data.token)} else {alert("Bad authentification");}})
            .catch(error => alert("Server error"))
    }


    return (
        <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
            <View style={styles.container}>
                <LoginForm 
                    username={username}
                    password={password}
                    setUsername={setUsername}
                    setPassword={setPassword}
                />
                <HStack spacing={2} >
                    <CustomButton
                        testID='id1'
                        title="login"
                        onPress={() => login(username, password)}
                        style={{ width: 120, backgroundColor: 'red', fontSize: 16 }} // Définissez le style ici
                    />
                    <Button
                        testID='id2'
                        variant="outlined"
                        title="register"
                        onPress={() => navigation.navigate("Register")}
                        style={{ backgroundColor: 'rgba(164, 118, 171, 0.3)', width: 120 }}
                    />
                </HStack>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
});