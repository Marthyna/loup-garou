import { sendGroupMessage } from '../utils/websocket';
import { ChatType } from '../utils/chatType';
import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

export default function WerewolfChatView({ werewolfMessages, userId, gameId, token }) {
    const [message, setMessage] = useState('');

    // Helper function to format the timestamp
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getHours()}:${date.getMinutes()}`;
    };

    const handleSend = () => {
        // Call sendGroupMessage with the entered message
        sendGroupMessage(ChatType.Werewolf, token, userId, gameId, message);
        setMessage('');
    }

    const renderItem = ({ item }) => {
        const isCurrentUser = item.userId === userId;

        const messageBalloonStyle = isCurrentUser
            ? [styles.balloon, styles.balloonCurrentUser]
            : [styles.balloon, styles.balloonOtherUser];

        const messageTextStyle = isCurrentUser
            ? [styles.messageText, styles.messageTextCurrentUser]
            : styles.messageText;

        const messageContainerStyle = isCurrentUser
            ? [styles.item, styles.currentUserMsgContainer]
            : [styles.item, styles.otherUserMsgContainer];

        return (
            <View style={messageContainerStyle}>
                <View >
                    <Text style={styles.sender}>{isCurrentUser ? 'You' : item.sender}</Text>
                    <View style={messageBalloonStyle}>
                        <Text style={messageTextStyle}>{item.messageContent}</Text>
                    </View>
                    <Text style={styles.time}>{formatTimestamp(item.timeStamp)}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={werewolfMessages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type your message here"
                />
                <Button title="Send" onPress={handleSend} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    textInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        margin: 10,
        borderRadius: 20,
        paddingHorizontal: 10
    },
    item: {
        marginVertical: 10,
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    balloon: {
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 6,
        maxWidth: '70%',
        marginBottom: 10,
    },
    balloonCurrentUser: {
        backgroundColor: '#728FCE',
    },
    balloonOtherUser: {
        backgroundColor: 'blue',
    },
    messageText: {
        fontSize: 16,
        color: 'white',
    },
    messageTextCurrentUser: {
        textAlign: 'right'
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
    sender: {
        marginBottom: 5,
        color: '#999',
    },
    currentUserMsgContainer: {
        justifyContent: 'flex-end'
    },
    otherUserMsgContainer: {
        justifyContent: 'flex-start'
    }
});