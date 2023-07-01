import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Stack, Text } from '@react-native-material/core';
import HomeNav from '../components/HomeNav';


import { connect, disconnect, initLobbyFunctions } from '../utils/websocket'
import PlayerList from '../components/PlayerList';

import config from '../config';


export default function LobbyPlayersView({disconnect, players, navigation}) {    

    useEffect(() => {
        if(players && players.length == 0) {
            alert("THIS GAME IS NO LONGER RUNNING!")
            navigation.navigate("Home")
        }

    }, [players])

    return (
        <View>
            <HomeNav 
                navigation={navigation}
                disconnect={disconnect}
            />
            <Text>Lobby Players</Text>
            
            <PlayerList 
                players={players}
            />
            
            
        </View>
    )
}