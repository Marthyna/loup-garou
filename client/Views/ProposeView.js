import { Button, ScrollView, StyleSheet, View } from 'react-native';
import PlayerList from '../components/PlayerList';
import { useEffect, useState } from 'react';
import { createProposition } from '../utils/websocket';
import { Text } from '@react-native-material/core';

const players = [];

// Generate list of 100 proposed players
for (let i = 1; i <= 100; i++) {
    players.push({
        id: i,
        username: `player${i}`
    });
}

export default function ProposeView({token, gameId, userId, alivePlayers}) {

    const [selectedVillager, setSelectedVillager] = useState(null)

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Select Player</Text>
            <ScrollView style={styles.scrollContainer}>
                <PlayerList
                    players={alivePlayers} 
                    setSelected={setSelectedVillager}
                />
            </ScrollView>
            <Button
                title="Propose"
                style={styles.button}
                onPress={() => {
                    if(selectedVillager != null)
                        createProposition(token, gameId, userId, selectedVillager)
                    else 
                        alert('You have not selected a villager to propose')
                }}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        marginHorizontal: '3em',
    },
    playersList: {
        height: '70%'
    }
});