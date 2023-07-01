//App.js
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginView from './Views/LoginView.js';
import HomeView from './Views/HomeView.js'
import RegisterView from './Views/RegisterView.js';
import NewGameView from './Views/NewGameView.js';
import LobbyNavigator from './Navigators/LobbyNavigator.js';
import GameNavigator from './Navigators/GameNavigator.js';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="Login" component={LoginView} />
                <Stack.Screen name="Register" component={RegisterView} />
                {/* <Stack.Screen name="Profile" component={ProfileView} /> */}
                <Stack.Screen name="Home" component={HomeView} />
                <Stack.Screen name="NewGame" component={NewGameView} />
                <Stack.Screen name="Lobby" component={LobbyNavigator} />
                <Stack.Screen name="Game" component={GameNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
