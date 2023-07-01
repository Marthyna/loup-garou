import { StyleSheet, Text, View } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

export default function CurrentPower({power}) {
    return ( 
        <View>
            <Text style={styles.currentPowerText}>You have the power of:</Text>
                <View style={styles.currentPowerContainer} >
                    {power.name === 'Clairvoyance' ? (<AntDesign name="eye" size={32} color="black" style={styles.icon} />) : null}
                    {power.name === 'Insomnia' ? (<FontAwesome5 name="cloud-moon" size={24} color="black" style={styles.icon} />) : null}
                    {power.name === 'Contamination' ? (<Entypo name="slideshare" size={24} color="black" style={styles.icon} />) : null}
                    {power.name === 'Psychic' ? (<AntDesign name="aliwangwang" size={32} color="black" style={styles.icon}/>) : null}

                    <View style={styles.powerInfo}>
                        <Text style={styles.powerTitle}>{power.name}</Text>
                        <Text style={styles.powerSubtitle}>{power.description}</Text>
                    </View>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    currentPowerText: {
        marginBottom: '1em',
        fontWeight: "300"
    },
    currentPowerContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        paddingBottom: 20,
        marginBottom: 20
    },
    powerInfo: {
        flex: 1,
    },
    powerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    powerSubtitle: {
        fontSize: 16,
    },
    icon: {
        marginRight: 20,
    },
});