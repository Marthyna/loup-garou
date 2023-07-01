import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { updateSetPropositions, updateSetAlivePlayers, updateSetDayTime, updateSetRole } from '../utils/websocket';
import { getGameId, getToken, getUserId } from '../utils/internalStorage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ChatNavigator from './ChatNavigator';
import VoteNavigator from './VoteNavigator';
import PowerView from '../Views/PowerView';

const BottomTab = createBottomTabNavigator();

export default function GameNavigator({route, navigation}) {
    // roles retrieval to be used client-side
    const {players, isWerewolf, hasPower, powerType} = route.params;
        
    const [token, setToken] = useState(null)
    const [gameId, setGameId] = useState(null)
    const [userId, setUserId] = useState(null)
    const [role, setRole] = useState(isWerewolf ? 'werewolf' : 'human')

    const [propositions, setPropositions] = useState([])
    const [alivePlayers, setAlivePlayers] = useState([])
    const [dayTime, setDayTime] = useState('day')

    updateSetPropositions(setPropositions)
    updateSetAlivePlayers(setAlivePlayers)
    updateSetDayTime(setDayTime)
    updateSetRole(setRole)


    useEffect(() => {
        setAlivePlayers(players)

        // retrieve all pertinent data (stored in the internal storage)
        getUserId().then(userId => setUserId(userId))
        getToken().then(token => setToken(token))
        getGameId().then(gameId => setGameId(gameId))
    }, [])

    return (
        <BottomTab.Navigator
            initialRouteName="Chat Navigator"
            screenOptions={{
                headerShown: false,
            }}
        >
            <BottomTab.Screen
                name="Vote Navigator"
                children={() => 
                    <VoteNavigator
                        userId={userId}
                        gameId={gameId}
                        token={token}
                        propositions={propositions}
                        alivePlayers={alivePlayers}
                    />
                }
                options={{
                    tabBarLabel: "Vote",
                    tabBarIcon: ({color, size}) => (
                        <MaterialIcons name="how-to-vote" color={color} size={size} />
                    ),
                }}
            />
            <BottomTab.Screen 
                name="Chat Navigator"
                children={() => 
                    <ChatNavigator 
                        userId={userId}
                        gameId={gameId}
                        token={token}
                    />
                }
                options={{
                    tabBarLabel: "Chat",
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="chatbubbles" size={size} color={color} />
                    ),
                }}
            />
            <BottomTab.Screen 
                name="Power"
                children={() => 
                    <PowerView
                        dayTime={dayTime}
                        powerType={powerType}
                        hasPower={hasPower}
                        userId={userId}
                        gameId={gameId}
                        token={token}
                    />
                }
                options={{
                    tabBarLabel: "Power",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="lightning-bolt" color={color} size={size} />
                    ),
                }}
            />
        </BottomTab.Navigator>
    )

}