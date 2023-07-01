import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Snackbar, Button, Stack, Flex } from '@react-native-material/core';
import { ImageBackground } from 'react-native';

import HomeNav from '../components/HomeNav';
import GamesList from '../components/GamesList';
const backgroundImage = require('../images/homeloup.jpg');

export default function HomeView( {navigation} ) {
    return (
        <View style={{flex: 1}}>
            <HomeNav navigation={navigation} />
            <Flex fill justify='space-between' style={{ marginHorizontal: 80, marginTop: 20 }}>
                <GamesList 
                    navigation={navigation}
                />
                <Button
                    testID='id-create'
                    title='Create Game'
                    style={styles.bottomButton}
                    onPress={() => navigation.navigate("NewGame")}
                />
            </Flex>
        
            {/* TODO
            implement snackbar containing game informations */}
            {/* <Snackbar
                message="Note archived."
                action={<Button variant="text" title="Dismiss" color="#BB86FC" compact />}
                style={{ position: "absolute", start: 16, end: 16, bottom: 16 }}
            /> */}

        </View>
    )
}

const styles = StyleSheet.create({
    bottomButton: {
        marginHorizontal: 40,
        marginVertical: 20
    }
})