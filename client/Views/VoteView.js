import { Button, ScrollView, StyleSheet, View } from 'react-native';
import PlayerList from '../components/PlayerList';
import PropositionList from '../components/PropositionList'
import { useState, useEffect } from 'react';
import { getGameId, getToken, getUserId } from '../utils/internalStorage';
import { createProposition, voteProposition } from '../utils/websocket';
import { Text } from '@react-native-material/core';


export default function VoteView({token, userId, gameId, propositions}) {

    const [selectedProposition, setSelectedProposition] = useState(null)

    useEffect(() => {
        console.log("NEW PROPOSITION", propositions);
    }, [propositions])

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Select Proposed Player</Text>
            <ScrollView style={styles.scrollContainer}>
                {/* <PlayerList players={players} /> */}
                <PropositionList
                    propositions={propositions} 
                    setSelected={setSelectedProposition}
                />
            </ScrollView>
            <Button
                title={"Vote"}
                onPress={() => {
                    if(selectedProposition!=null)
                        voteProposition(token, gameId, userId, selectedProposition.propositionId)
                    else
                        alert("You have not selected someone to vote")
                }}
                style={styles.button}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: '3em',
    },
    playersList: {
        flex: 1
    },
    button: {
        marginTop: 20
    }
});