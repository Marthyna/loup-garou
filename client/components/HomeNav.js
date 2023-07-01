import { StyleSheet, View, Pressable, Text } from 'react-native';
import { AppBar, Button, IconButton } from '@react-native-material/core';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { disconnect } from '../utils/websocket';

export default function HomeNav( {navigation, disconnect } ) {

    return (
        <AppBar
            style={{paddingTop: 20, padding: 5}} 
            title="Loup-Garou"
            leading={
                <IconButton 
                    icon={props => 
                        <Icon name="chevron-left" {...props} color="white" />
                    }
                    onPress={() => {
                        // disconnect from the game that you was, if any
                        if(disconnect != null) 
                            disconnect()
                        navigation.goBack()
                    }}
                />
            }
            trailing={props => 
                <Button
                    variant="text"
                    title="Logout"
                    compact
                    style={{ marginEnd: 4 }}
                    onPress={() => {
                        if(disconnect != null) 
                            disconnect()
                        navigation.navigate("Login")
                    }}
                    {...props}
                /> 
            }
        />
    )
}
