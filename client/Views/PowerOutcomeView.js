import { StyleSheet, Text, View } from "react-native";
import { Header } from "react-native-elements";
import CurrentPower from "../components/CurrentPower";
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import PowerUsed from "../components/PowerUsed";

export default function PowerOutcomeView({ route }) {
    const player = route.params.dummyPlayer;
    const power = route.params.power;

    return (
        <View>
            <Header
                centerComponent={{ text: 'Use Power', style: { color: '#fff', fontSize: 20 } }}
                containerStyle={styles.header}
            />
            <View style={styles.subContainer}>
                <CurrentPower power={power}></CurrentPower>
                {power.name === 'Clairvoyance' ? (
                    <View>
                        <View style={styles.powerAnounceCont}>
                            <Text style={styles.powerAnounceText}>{player.username} has:</Text>
                        </View>
                        <View>
                            <Text style={styles.infoText}>Role:</Text>
                            <View style={styles.infoDetailsCont} >
                                {/* customize */}
                                <Entypo name="baidu" size={32} color="black" style={styles.icon} />
                                <View style={styles.info}>
                                    <Text style={styles.infoTitle}>{player.role}</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.infoText}>Power:</Text>
                            <View style={styles.infoDetailsCont} >
                                {/* customize */}
                                <AntDesign name="aliwangwang" size={32} color="black" style={styles.icon} />
                                <View style={styles.info}>
                                    <Text style={styles.infoTitle}>{player.power.name}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ) : null}
                {power.name === 'Contamination' ? (
                    <View>
                        <View style={styles.powerAnounceCont}>
                            <Text style={styles.powerAnounceText}>{player.username} was turned into a werewolf!</Text>
                        </View>
                    </View>
                ) : null}
                {power.name === 'Insomnia' ? (
                    <View>
                        <View style={styles.powerAnounceCont}>
                            <Text style={styles.powerAnounceText}>You can now access the Wolves' Chat!</Text>
                        </View>
                    </View>
                ) : null}
                {power.name === 'Psychic' ? (
                    <View>
                        <View style={styles.powerAnounceCont}>
                            <Text style={styles.powerAnounceText}>Private Chat with {player.username}</Text>
                        </View>
                        
                    </View>
                ) : null}
                <PowerUsed></PowerUsed>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    infoText: {
        marginBottom: '1em',
        fontWeight: "300"
    },
    infoDetailsCont: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        paddingBottom: 20,
        marginBottom: 20
    },
    infoTitle: {
        fontSize: 16,
        marginBottom: 5,
    },
    info: {
        flex: 1,
    },
    icon: {
        marginRight: 20,
    },
    header: {
        width: '100%',
        backgroundColor: '#585656',
        height: 60
    },
    subContainer: {
        marginHorizontal: '3em',
        paddingTop: '3em'
    },
    powerAnounceText: {
        alignSelf: "center",
        fontSize: 20,
        fontWeight: "bold",
    },
    powerAnounceCont: {
        marginTop: '2em',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        paddingBottom: 10,
        marginBottom: 20
    }
});