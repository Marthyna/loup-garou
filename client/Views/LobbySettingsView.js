import { StyleSheet, View } from 'react-native';
import { Button, Stack, Text } from '@react-native-material/core';
import HomeNav from '../components/HomeNav';
import { useEffect } from 'react';

export default function LobbySettingsView({disconnect, settings, setSettings, matchId, navigation}) {

    return (
        <View>
            <HomeNav 
                navigation={navigation}
                disconnect={disconnect}
            />
            <Text>Lobby Settings</Text>
        </View>
    )
}