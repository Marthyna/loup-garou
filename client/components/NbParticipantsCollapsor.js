import { View, Platform } from "react-native";
import { Flex, Icon, Text } from "@react-native-material/core";
import { AntDesign } from '@expo/vector-icons';

export default function ProbabilitiesCollapsor({collapsed}) {
    if (Platform.OS === 'web') {
        return (
            <View 
                // style={styles.header}
            >
                <Text >           
                    Number of Participants 
                </Text>
                <AntDesign
                    name={collapsed ? 'down' : 'up'}
                    size={20}
                    color="black"
                />
            </View>
        );
    } else {
        return (
            <Flex direction="row" justify="space-between">
                <Text>Number of Participants</Text>
                <Icon testID = "icon_d" size={20} name={collapsed ? "chevron-down" : "chevron-up"} />
            </Flex>
        );
    }
}