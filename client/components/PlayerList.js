import { ListItem } from "@react-native-material/core";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PlayerList({ players, title, setSelected }) {

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{title}</Text>
            <ScrollView style={styles.scrollContainer}>
                {
                    players && players.map((element, index) =>
                        <ListItem
                            key={index}
                            title={element.username}
                            onPress={() => setSelected(element.id)}
                    />
                    )
                }
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        height: '70%',
        marginBottom: '2em',
        marginTop: '2em'
    },
    header: {
        marginBottom: '1em',
        fontWeight: 'bold',
        fontSize: 20
    },
    scrollContainer: {
        height: 100
    }
});