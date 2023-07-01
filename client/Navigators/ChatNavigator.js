import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import WerewolfChatView from "../Views/WerewolfChatView";
import { useEffect, useState } from "react";
import { updateSetParkMessages, updateSetWerewolfMessages } from "../utils/websocket"
import MainChatView from '../Views/MainChatView'

export default function ChatNavigator({ navigation, userId, gameId, token  }) {
    const TopTab = createMaterialTopTabNavigator();

    // create the variables to keep the messages
    const [parkMessages, setParkMessages] = useState([])
    const [werewolfMessages, setWerewolfMessages] = useState([])

    useEffect(() => {
        // passes the functions to the websocket controller
        updateSetParkMessages(setParkMessages)
        updateSetWerewolfMessages(setWerewolfMessages)
    }, [])

    return (
        <TopTab.Navigator
            initialRouteName="Park Chat"
            screenOptions={{
                tabBarStyle: {
                    paddingTop: 10
                },
                tabBarLabelStyle: { fontSize: 10 },
            }}
        >
            <TopTab.Screen
                name="Park Chat"
                children={() =>
                    <MainChatView
                        userId={userId}
                        gameId={gameId}
                        token={token}
                        parkMessages={parkMessages}
                        setParkMessages={setParkMessages}
                    />
                }
                options={{
                    tabBarLabel: "Park Chat",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="pets" color={color} size={25} />
                    ),
                }}
            />
            <TopTab.Screen
                name="Werewolf Chat"
                children={() =>
                    <WerewolfChatView
                        userId={userId}
                        gameId={gameId}
                        token={token}
                        werewolfMessages={werewolfMessages}
                        setWerewolfMessages={setWerewolfMessages}
                    />
                }
                options={{
                    tabBarLabel: "Werewolf Chat",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="tree" color={color} size={23} />
                    ),
                }}
            />
        </TopTab.Navigator>
    )

}