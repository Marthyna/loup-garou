import { Header } from 'react-native-elements';
import { Button, StyleSheet, View } from 'react-native';
import TargetList from "../components/TargetList";
import { useNavigation } from '@react-navigation/native';
import CurrentPower from '../components/CurrentPower';
import PowerOutcomeView from './PowerOutcomeView';
import { Powers, getPowerDetails } from '../utils/powerTypes';
import { Text } from '@react-native-material/core';
import { useEffect, useState } from 'react';
import { postHeader, getAuthenticationHeader } from '../utils/requests'

import config from '../config.js';
import { createBody } from '../utils/requests';
import { sendUsePower } from '../utils/websocket';
const BACKEND = config.BACKEND_URL;

const players = [];
const dummyPlayer = {
    username: 'player1',
    role: 'werewolf',
    power: { name: 'Psychic', description: 'Talk to a deceived villager in a private chat' }
}

// Generate list of 100 players
for (let i = 1; i <= 100; i++) {
    players.push({
        id: i,
        username: `player${i}`
    });
}


export default function PowerView({ route, dayTime, gameId, userId, token, hasPower, powerType }) {
    const navigation = useNavigation();

    const [targetablePlayers, setTargetablePlayers] = useState([])
    const [selectedTarget, setSelectedTarget] = useState([])

    function handleUsePower() {
        navigation.navigate('PowerOutcomeView', { dummyPlayer, power });
    }


    // for the powers we can use fetch to search for the data, as a real-time connection don't change much
    // e.g. in the vote area, we had new propositions that could come up at any second.
    // the only event we have to keep our eyes open about is the passage from night to day and vice-versa
    useEffect(() => {
        // if(dayTime == 'night') {
            const body = createBody({gameId, powerType})
            getAuthenticationHeader()
            .then(authHeader => {
                fetch(`${BACKEND}/power`, {
                    method: "POST",
                    body,
                    headers: {...postHeader, ...authHeader}
                })
                .then(response => response.json())
                .then(possibleTargets => {
                    setTargetablePlayers(possibleTargets.villagers)
                })
            })
            .catch(err => alert("Server error"))
        // }
        // else {
        //     setTargetablePlayers([])
        // }
    }, [dayTime])


    return (
        <View>
            <Header
                centerComponent={{ text: 'Use Power', style: { color: '#fff', fontSize: 20 } }}
                containerStyle={styles.header}
            />
            <View style={styles.subContainer}>
                { hasPower ? (
                    <>
                        <CurrentPower power={getPowerDetails(powerType)} />
                        {powerType == Powers.Clairvoyance || powerType == Powers.Contamination ? (
                            <TargetList
                                setSelected={setSelectedTarget}
                                title={"Select Player"}
                                players={targetablePlayers} />
                            ) : null}
                        {powerType == Powers.Psychic
                        // power.name === "Psychic" 
                        ? (
                            <TargetList
                                setSelected={setSelectedTarget}
                                title={"Select deceived Player"}
                                players={targetablePlayers} />
                            ) : null}
                        <Button
                            title="Use Power"
                            style={styles.button}
                            onPress={() => {
                                // gameId, userId, powerType, args
                                sendUsePower(gameId, userId, powerType, {targetVillager: selectedTarget.villagerId})
                            }}
                        />
                    </>
                ) : <Text>You have no power!</Text>}
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    subContainer: {
        marginHorizontal: '3em',
        paddingTop: '3em'
    },
    header: {
        width: '100%',
        backgroundColor: '#585656',
        height: 60
    },
    playerList: {
        marginTop: 20
    }
});