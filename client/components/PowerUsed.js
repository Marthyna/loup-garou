import { StyleSheet, Text, View } from "react-native";

export default function PowerUsed() {
    return (
        <View style={styles.powerUsed}>
            <Text style={styles.powerUsedText}>You have used your power for this round.</Text>
            <Text style={styles.powerUsedText}>Wait for the next round to use it again.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    powerUsed: {
        alignItems: "center",
        marginTop: 20
    },
    powerUsedText: {
        color: 'grey',
        fontSize: 12
    }
});