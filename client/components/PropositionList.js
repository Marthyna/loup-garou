import { ListItem } from "@react-native-material/core"
import { View } from "react-native"


export default function PropositionList({propositions, setSelected}) {

    // for now, just get the player list
    return (
        <View>
            {
                // available elements: {propositionId, authorVillager, proposedVillager, nbVotes, usernameAuthor, usernameProposed}
                propositions && propositions.map((element, index) =>
                    <ListItem
                        key={index}
                        title={element.usernameProposed}
                        onPress={() => setSelected(element)}
                    />
                )
            }
        </View>
    )


}