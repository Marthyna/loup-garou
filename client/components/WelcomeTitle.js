import React from 'react';
import {StyleSheet, View, Image, Text } from 'react-native';


export default function Welcome() {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../images/loupicon.png')}
            style={{ width: 50, height: 50, marginBottom: 20}}
          />
         <Text style={styles.title}>Welcome to Loupgarou's Game</Text>
        </View>
      )
    }

const styles = StyleSheet.create({
    title : {
        // color: 'rgba(255, 99, 71, 1)',
        marginTop: 20,
        fontSize: 20,
        marginBottom : 40,
        textAlign: 'center',    
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
})