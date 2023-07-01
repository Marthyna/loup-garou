import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LobbyPlayersView from '../Views/LobbyPlayerView';
import LobbySettingsView from '../Views/LobbySettingsView';
import { useEffect, useState } from 'react';

import { connect, disconnect, updateSetSettings, setNavigation, updateSetPlayers } from '../utils/websocket'
import { setGameId } from '../utils/internalStorage';

export default function LobbyNavigator({route, navigation}) {
    // create the navigation bar
    const BottomTab = createBottomTabNavigator()
    
    // create the states that the screens will be needing
    const [players, setPlayers] = useState(null)
    const [settings, setSettings] = useState([])

    const {id} = route.params

    useEffect(() => {
        // connect to the server websocket
        connect(id)
        // set the functions
        setNavigation(navigation)
        updateSetPlayers(setPlayers)
        updateSetSettings(setSettings)
    }, []);

    const disconnectWebsocket = async () => {
        // refresh the internal store game id
        await setGameId(null)
        disconnect(id)
    }


    return (
        <BottomTab.Navigator
            screenOptions={{ 
                headerShown: false,
            }}
        >
            <BottomTab.Screen 
                name="Players"
                children={() => (
                    <LobbyPlayersView
                        disconnect={disconnectWebsocket}
                        players={players}
                        navigation={navigation}
                    />
                )}
                options={{
                    tabBarLabel: "Players",
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="people" size={size} color={color} />
                    ),
                }}
            />
            <BottomTab.Screen 
                name="Settings"
                children={() => (
                    <LobbySettingsView 
                        disconnect={disconnectWebsocket}
                        settings={settings}
                        setSettings={setSettings}
                        matchId={id}
                        navigation={navigation}
                    />
                )}
                options={{
                    tabBarLabel: "Settings",
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="settings" size={size} color={color} />
                    ),
                }}
            />
        </BottomTab.Navigator>
    )

}

