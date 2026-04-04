import React, { useCallback, useContext, useEffect, useState } from 'react'
import { FlatList, StyleSheet, TextInput, View } from 'react-native'
import Chat from '../components/Chat'
// import { chats } from '../data/chats'
import Icon from 'react-native-vector-icons/Ionicons';
import BASE_URL from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const ChatsScreen = () => {
  const { token } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState([]);
  const getChats = async () => {
    const res = await fetch(`${BASE_URL}/api/messages`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    const data = await res.json();
    setChats(data);
  }
  useFocusEffect(
    useCallback(() => {
      getChats();
    }, [])
  );
  return (
    <View style={styles.container}>
      <View style={styles.search_container}>
        <Icon name="search-outline" size={22} color="#888" />
        <View style={styles.separator} />
        <TextInput
          placeholder="Search chats..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          style={styles.search}
        />
      </View>
      <FlatList data={chats}
        keyExtractor={(item) => item.user._id}
        renderItem={({ item }) => <Chat chat={item} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#000'
  },
  search_container: {
    marginBottom: 10,
    marginHorizontal: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#1c1c1c',
  },
  separator: {
    width: 1,
    height: "100%",
    backgroundColor: 'rgb(140, 140, 140)'
  },
  search: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
})

export default ChatsScreen
