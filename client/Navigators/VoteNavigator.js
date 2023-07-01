import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import VoteView from "../Views/VoteView";
import ProposeView from "../Views/ProposeView";
import { useEffect } from 'react';
import { getAlivePlayers } from '../utils/websocket';
import { getGameId, getToken } from '../utils/internalStorage';

export default function VoteNavigator({propositions, alivePlayers, userId, gameId, token}) {
    const TopTab = createMaterialTopTabNavigator();

    return (
        <TopTab.Navigator
            screenOptions={{
                tabBarStyle: {
                    paddingTop: 10,
                }
            }}
        >
            <TopTab.Screen 
                name="Vote"
                children={() => 
                    <VoteView
                        userId={userId}
                        gameId={gameId}
                        token={token}
                        propositions={propositions}
                    />
                }
            />
            <TopTab.Screen 
                name="Propose"
                // component={ProposeView}
                children={() => 
                    <ProposeView 
                        userId={userId}
                        gameId={gameId}
                        token={token}
                        alivePlayers={alivePlayers}
                    />
                }
            />
        </TopTab.Navigator>
    )

}