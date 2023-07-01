import { StyleSheet, View, Pressable, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { Provider, IconButton, Button, ListItem, Divider, Snackbar } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { FlatList } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { RefreshControl } from 'react-native';
import { postHeader, getAuthenticationHeader } from '../utils/requests'

import config from '../config.js';
import { setGameId } from '../utils/internalStorage';
const BACKEND = config.BACKEND_URL;

export default function GamesList({ navigation }) {
    const [visible, setVisible] = useState(true)
    const [gamesList, setGamesList] = useState(null)
    const [refreshing, setRefreshing] = useState(true);

    useEffect(() => {
        loadGamesList();
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadGamesList()
        });
    }, [navigation])

    const loadGamesList = () => {
        getAuthenticationHeader()
        .then(authHeader => 
            fetch(`${BACKEND}/matches`, {
                method: 'GET',
                headers: {...postHeader, ...authHeader}
            })
            .then(response => response.json())
            .then(response => {
                setRefreshing(false);
                setGamesList(response.notStartedMatches)
            })
        )
    }

    const renderItem = ({item}) => {
        return (
            <ListItem 
                key={item.id}
                title={item.name}
                leading={<IconButton icon={props => <Icon name="information-outline" onPress={() => setVisible(value => !value)} {...props} {...props} />} />}
                trailing={props => 
                    <IconButton 
                        icon={props => 
                            <Icon 
                                name="chevron-right" 
                                {...props} 
                            />} 
                        onPress={async () => {
                            // set the internal store game id
                            await setGameId(item.id)
                            navigation.navigate("Lobby", {id: item.id})
                        }}
                />}
            />
        )
    }  

    const renderSeparator = () => {
        return (
            <Divider />
        )
    }

    return (
        <View>
            {refreshing ? <ActivityIndicator /> : null}
            <FlatList
                data={gamesList}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={renderSeparator}
                enableEmptySections={true}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadGamesList} />
                }
            />

        </View>
    )
}