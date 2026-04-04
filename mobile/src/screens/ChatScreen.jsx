import React, { useContext, useEffect, useRef, useState } from 'react'
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import socket from "../services/socket";
import { AuthContext } from '../context/AuthContext';
import BASE_URL from '../api/api';
import defaultAvatar from '../utils/defaultAvatar';

const ChatScreen = ({ route }) => {
    const { user, token } = useContext(AuthContext);
    const { otherUser } = route.params;
    const navigation = useNavigation();
    const flatListRef = useRef(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const getMessages = async () => {
        const res = await fetch(`${BASE_URL}/api/messages/${otherUser._id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        const data = await res.json();
        setMessages(data);
    };

    useEffect(() => {
        getMessages();
    }, [otherUser]);

    useEffect(() => {
        socket.emit("join_chat", {
            userId: user._id,
            otherUserId: otherUser._id
        });
    }, []);

    useEffect(() => {
        socket.on("receive_message", (message) => {
            setMessages(prev => [...prev, message]);
        });
        return () => socket.off("receive_message");
    }, []);

    const sendMessage = async () => {
        if (!message.trim()) return;
        const res = await fetch(`${BASE_URL}/api/messages/${otherUser._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ text: message })
        });
        // const newMessage = await res.json();
        // setMessages(prev => [...prev, newMessage]);
        setMessage("");
    };

    const renderMessage = ({ item }) => {
        const isMe = (item.sender?._id || item.sender) === user._id;
        return (
            <View style={[{
                alignSelf: isMe ? "flex-end" : "flex-start",
                backgroundColor: isMe ? "#00a884" : "#1c1c1c",
            }, styles.message]}>
                <Text style={styles.message_text}>{item.text}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.chat_header_container}>
                <View style={styles.chat_header_left}>
                    <Icon
                        name="arrow-back"
                        size={24}
                        color="#fff"
                        onPress={() => navigation.goBack()}
                    />
                    <Image
                        source={{ uri: otherUser.profilePic || defaultAvatar(otherUser.username) }}
                        style={styles.chat_header_avatar}
                    />
                    <Text style={styles.chat_header_name}>{otherUser.username}</Text>
                </View>
                <View style={styles.chat_header_right}>
                    <Icon
                        name="call-outline"
                        size={24}
                        color="#fff"
                    />
                    <Icon
                        name="videocam-outline"
                        size={24}
                        color="#fff"
                    />
                    <Icon
                        name="ellipsis-vertical"
                        size={24}
                        color="#fff"
                    />
                </View>
            </View>
            <View style={styles.messages_area}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item._id}
                    renderItem={renderMessage}
                    onContentSizeChange={() =>
                        flatListRef.current?.scrollToEnd({ animated: false })
                    }
                />
            </View>
            <View style={styles.message_container}>
                {/* <Icon name="attach-outline" size={28} color="#fff" /> */}
                <TextInput
                    placeholder="Message..."
                    placeholderTextColor="#888"
                    value={message}
                    onChangeText={setMessage}
                    style={styles.text_input}
                />
                {message.trim() ? (
                    <Pressable style={styles.send_btn} onPress={sendMessage}>
                        <Icon name="send" size={24} color="#00a884" />
                    </Pressable>
                ) : (
                    <Pressable style={styles.mic_btn}>
                        <Icon name="mic-outline" size={24} color="#fff" />
                    </Pressable>
                )}
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 0,
        padding: 0,
        backgroundColor: "#000"
    },
    chat_header_container: {
        // flex: 1,
        margin: 0,
        paddingVertical: 20,
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#000',
        borderWidth: 1,
        borderBottomColor: "#5b5b5b",
    },
    chat_header_left: {
        flexDirection: 'row',
        alignItems: "center",
        gap: 10
    },
    chat_header_name: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    chat_header_avatar: {
        height: 30,
        width: 30,
        borderRadius: 999
    },
    chat_header_right: {
        flexDirection: 'row',
        gap: 15
    },
    message: {
        margin: 5,
        padding: 10,
        borderRadius: 10,
        maxWidth: "75%"
    },
    message_text: {
        fontSize: 15,
        color: "#fff"
    },
    messages_area: {
        flex: 1
    },
    message_container: {
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8
    },
    text_input: {
        flex: 1,
        paddingHorizontal: 15,
        color: '#fff',
        borderRadius: 10,
        fontSize: 16,
        backgroundColor: '#1c1c1c'
    },
    mic_btn: {
        padding: 5,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 999
    },
    send_btn: {
        padding: 7,
        borderWidth: 1,
        borderColor: '#00a8848a',
        borderRadius: 10
    }
})
export default ChatScreen
