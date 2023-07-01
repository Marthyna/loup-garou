import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, HStack } from '@react-native-material/core';
import { ImageBackground } from 'react-native';

import config from '../config.js';
import LoginForm from '../components/LoginForm.js';
import { createBody, postHeader } from '../utils/requests.js';

const BACKEND = config.BACKEND_URL;
const backgroundImage = require('../images/loupgarou.jpg');


export default function RegisterView({navigation}) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function register(username, password){

    const data = {
      username,
      password
    }
    const body = createBody(data)

    fetch(`${BACKEND}/user/register`,{
      method:'POST',
      headers: postHeader,
      body
    })
    .then(response => {
      if (!response.ok) { 
        alert("not valid username or password") 
      }
      // if the response is positive, we can navigate to the home page
      else {
        alert("Registered with success!")
        navigation.navigate("Home")
      }
    })
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
      <HStack spacing={6} style={styles.buttons}>
        <Button 
          title="Register"
          onPress={() => register(username, password)}
          style={{width: 120}}
        />
        <Button 
          variant="outlined"
          title="cancel"
          onPress={() => navigation.navigate("Login")}
          style={{backgroundColor: 'rgba(164, 118, 171, 0.4)',width: 120}}
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
      justifyContent: 'center',
  },
  buttons: {
      flexDirection: 'row',
      alignContent: 'space-between',
      marginTop: 20
  }
});