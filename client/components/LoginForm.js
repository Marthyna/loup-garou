//App.js
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, IconButton } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import WelcomeTitle from "./WelcomeTitle.js";

export default function LoginForm({ username, password, setUsername, setPassword }) {
  const [mask, setMask] = useState(true);

  return (
    <>
      <WelcomeTitle/>
      <TextInput 
        testID='username-input'
        style={{width: 275}}
        value={username}
        label='Username'
        onChangeText={user => setUsername(user)}
      />
      <TextInput
        // style={styles.inputField}
        testID='password-input'
        label='Password'
        secureTextEntry={mask}
        value={password}
        onChangeText={password => setPassword(password)}
        trailing={props => (
          <IconButton onPress={() => setMask(mask ? false : true)} icon={props => <Icon name="eye"  {...props} />} />
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  inputField: {
    width: 250,
    marginBottom: '2em'
  }
});
