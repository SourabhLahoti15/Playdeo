import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import defaultAvatar from '../utils/defaultAvatar';

const Chat = ({ chat }) => {
    const navigation = useNavigation();

    return (
        <Pressable style={styles.container} onPress={() => navigation.navigate('Chat', { otherUser: chat.user })}>
            <Image source={{ uri: chat.user?.profilePic || defaultAvatar(chat.user?.username) }} style={styles.avatar} />
            <View style={styles.item}>
                <View style={styles.item_top}>
                    <Text style={styles.name}>{chat.user.username}</Text>
                    <Text style={styles.time}>{new Date(chat.lastMessage.createdAt).toLocaleString()}</Text>
                </View>
                <Text style={styles.message} numberOfLines={1}>
                    {chat.lastMessage.text}
                </Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        height: 80,
        width: '100%',
        color: 'white',
        backgroundColor: 'rgb(0, 0, 0)',
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        gap: 20,
        borderBottomWidth: 1,
        borderColor: 'grey'
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 999
    },
    item: {
        flex: 1,
        padding: 5,
        color: 'white',
        // backgroundColor: 'red'
    },
    item_top: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    name: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    time: {
        color: 'rgb(200, 200, 200)'
    },
    message: {
        color: 'rgb(190, 190, 190)'
    }
})

export default Chat
