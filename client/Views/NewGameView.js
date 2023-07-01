import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import { VStack, Divider, Button, TextInput } from "@react-native-material/core";
import { ImageBackground } from 'react-native';
import Collapsible from 'react-native-collapsible';
import HomeNav from "../components/HomeNav";
import ValueSelector from "../components/ValueSelector";
import ProbabilitiesCollapsor from "../components/ProbabilitiesCollapsor";
import NbParticipantsCollapsor from "../components/NbParticipantsCollapsor";
import RangeNbParticipantsCollapsor from "../components/RangeNbParticipantsCollapsor";
import StartTimePicker from "../components/StartTimePicker";
import { createBody, getAuthenticationHeader, postHeader } from "../utils/requests";
import config from '../config.js';
import { getOptions } from "../utils/parameters";
import { getDefaultDate } from '../utils/date'
import { setGameId } from "../utils/internalStorage";

const BACKEND = config.BACKEND_URL;
const backgroundImage = require('../images/createIcon.png');

export default function ({ navigation }) {
    // manages the state of the collapsed menu
    const [collapsedNb, setCollapsedNb] = useState(true);
    const [collapsedRange, setCollapsedRange] = useState(true);
    const [collapsedprob, setCollapsedprob] = useState(true);

    // manage the states of the parameters
    const [name, setName] = useState("")
    const [minNbParticipants, setMinNbParticipants] = useState(5);
    const [maxNbParticipants, setMaxNbParticipants] = useState(20);
    const [dayDuration, setDayDuration] = useState('14:00');
    const [nightDuration, setNightDuration] = useState('10:00');
    const [startDate, setstartDate] = useState( getDefaultDate() );
    const [werewolfProp, setWerewolfProp] = useState(1/3);

    // manage the state of the powers
    const [contamination, setContamination] = useState(0);
    const [insomnia, setInsomnia] = useState(0);
    const [clairvoyance, setClairvoyance] = useState(0);
    const [psychic, setPsychic] = useState(0);

    // get all the options for the parameters
    const { 
        participantsOptions,
        dayDurationOptions,
        nightDurationOptions,
        dayStartOptions,
        powerProbsOptions,
        werewolfPropOptions
    } = getOptions()

    // asks the backend to start a new game (in lobby phase)
    const createGame = async () => {
        return getAuthenticationHeader()
        .then(authHeader => {
            // create the body of the message containing all parameters
            const body = createBody({
                name,
                minNbParticipants,
                maxNbParticipants,
                dayDuration,
                nightDuration,
                startDate,
                werewolfProp,
                contaminationProb: contamination,
                insomniaProb: insomnia,
                clairvoyanceProb: clairvoyance,
                psychicProb: psychic
            })

            return fetch(`${BACKEND}/match/new`, {
                method: 'POST',
                headers: {...postHeader, ...authHeader},
                body
            })
            .then(response => response.json())
            .then(response => {
                const {gameId} = response
                // save it to the internal storage
                setGameId(gameId)
                return gameId
            })
        })
        
    }

    return (
        <View style={styles.mainView}>
            <HomeNav 
                navigation={navigation} 
            />

            <VStack shouldWrapChildren={true} m={10} spacing={10} >
                {/* to choose the name of the match */}
                <TextInput 
                    value={name}
                    label = 'Game Name'
                    onChangeText={gameName => setName(gameName)}
                />
                {/* to pick the specified number of participants */}

                <TouchableOpacity 
                    testID = "opacity_id"
                    onPress={() => setCollapsedNb(!collapsedNb)}>
                    <NbParticipantsCollapsor collapsedNb={collapsedNb}/>
                </TouchableOpacity>
                <Collapsible collapsed={collapsedNb} collapsedHeight={0}>
                <VStack shouldWrapChildren={true} m={10} spacing={10}>
                    <ValueSelector
                        label={"Number of Participants"}
                        onValueChange={(value) => {
                            setMinNbParticipants(value)
                            setMaxNbParticipants(value)
                        }}
                        value={maxNbParticipants}
                        prompt={"Select number of participants"}
                        options={participantsOptions}
                        title={"Number of Participants"}
                    />
                </VStack>
                </Collapsible>
                <Divider />
                {/* to pick the range number of participants */}
                <TouchableOpacity 
                    onPress={() => setCollapsedRange(!collapsedRange)}>
                    <RangeNbParticipantsCollapsor collapsedRange={collapsedRange}/>
                </TouchableOpacity>
                <Collapsible collapsed={collapsedRange} collapsedHeight={0}>
                <VStack shouldWrapChildren={true} m={10} spacing={10}>
                <ValueSelector
                    label={"Min Number of Participants"}
                    onValueChange={(value) => {
                        setMinNbParticipants(value)
                    }}
                    value={minNbParticipants}
                    prompt={"Select number of participants"}
                    options={participantsOptions}
                    title={"Min Number of Participants"}
                />
                <Divider />

                <ValueSelector
                    label={"Max Number of Participants"}
                    onValueChange={(value) => setMaxNbParticipants(value)}
                    value={maxNbParticipants}
                    prompt={"Select number of participants"}
                    options={participantsOptions}
                    title={"Max Number of Participants"}
                />
                </VStack>
                </Collapsible>
                <Divider />

                {/* to pick the day duration time */}
                <ValueSelector
                    label={'Select day duration'}
                    onValueChange={(value) => setDayDuration(value)}
                    value={dayDuration}
                    prompt={'Select day duration'}
                    options={dayDurationOptions}
                    title={"Day Duration"}
                />

                {/* to pick the night duration time */}
                <ValueSelector
                    label={'Select night duration'}
                    onValueChange={(value) => setNightDuration(value)}
                    value={nightDuration}
                    prompt={'Select night duration'}
                    options={nightDurationOptions}
                    title={"Night Duration"}
                />
                <Divider />

                {/* to pick the hour that the day starts */}
                <ValueSelector
                    label={'Select day start time'}
                    onValueChange={(value) => setDayStart(value)}
                    value={startDate}
                    prompt={'Select day start time'}
                    options={dayStartOptions}
                    title={"Daytime Starting Hour"}
                />
                <StartTimePicker 
                    setDate={setstartDate}
                />

                <Divider />

                {/* to pick the power probabilities */}
                <TouchableOpacity 
                    onPress={() => setCollapsedprob(!collapsedprob)}>
                    <ProbabilitiesCollapsor collapsedprob={collapsedprob}/>
                </TouchableOpacity>
                <Collapsible collapsed={collapsedprob} collapsedHeight={0}>
                    <VStack shouldWrapChildren={true} m={10} spacing={10}>
                        <Divider />
                        <ValueSelector
                            label={"Contamination"}
                            onValueChange={(value) => setContamination(value)}
                            value={contamination}
                            options={powerProbsOptions}
                            prompt="Contamination"
                            title={"Contamination"}
                        />
                        <Divider />
                        <ValueSelector
                            label={"Insomnia"}
                            onValueChange={(value) => setInsomnia(value)}
                            value={insomnia}
                            options={powerProbsOptions}
                            prompt="Insomnia"
                            title={"Insomnia"}
                        />
                        <Divider />
                        <ValueSelector
                            label={"Clairvoyance"}
                            onValueChange={(value) => setClairvoyance(value)}
                            value={clairvoyance}
                            options={powerProbsOptions}
                            prompt="Clairvoyance"
                            title={"Clairvoyance"}

                        />
                        <Divider />
                        <ValueSelector
                            label={"Psychic"}
                            onValueChange={(value) => setPsychic(value)}
                            value={psychic}
                            options={powerProbsOptions}
                            prompt="Psychic"
                            title={"Psychic"}
                        />
                    </VStack>
                </Collapsible>
                <Divider />

                {/* to pick the werewolf proportion */}
                <ValueSelector
                    label={'Werewolf proportion'}
                    onValueChange={(value) => setWerewolfProp(value)}
                    value={werewolfProp}
                    options={werewolfPropOptions}
                    prompt={'Werewolf proportion'}
                    title={"Werewolf Proportion"}
                />

            <Button 
                variant="contained" 
                style={styles.button} 
                title="Create Match" 
                onPress={() => {
                    // we wait for the game creation, that will retrieve its id
                    createGame()
                    .then(gameId => {
                        // and then we can go to the created game page
                        navigation.navigate("Lobby", {id: gameId})
                    })
                }}
            />
            </VStack>
        </View>
    )
}


const styles = StyleSheet.create({
    mainView: {
        height: 'fit-content'
    },
    picker: {
        width: '50%',
        height: 50,
        backgroundColor: '#e6e6e6',
        borderRadius: 10,
        paddingHorizontal: 10,
        alignSelf: "center",
    },
    pickerItem: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f2f2f2',
        width:'50%',
        alignSelf: "center"
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    icon: {
        marginLeft: 10,
    },
    button: {
        width: '50%',
        alignSelf: "center",
        margin: 50
    }
});