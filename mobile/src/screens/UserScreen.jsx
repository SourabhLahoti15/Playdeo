import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { AuthContext } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

const UserScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user, setUser, setToken } = useContext(AuthContext);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["user", "token"]);
    setUser(null);
    setToken(null);
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <Pressable style={styles.btn} onPress={() => navigation.navigate("Profile", {
          userId: user._id
        })}>
          <Text style={styles.text}>Profile</Text>
        </Pressable>
        <Pressable style={styles.btn}>
          <Text style={styles.text}>Bookmarks</Text>
        </Pressable>
        <Pressable style={styles.btn}>
          <Text style={styles.text}>About</Text>
        </Pressable>
        <Pressable style={styles.btn}>
          <Text style={styles.text}>Settings</Text>
        </Pressable>
      </ScrollView>
      <Pressable style={[styles.logout_btn, { bottom: insets.bottom }]} onPress={handleLogout}>
        <Text style={styles.logout_text}>Logout</Text>
      </Pressable>
    </>
  )
}
export default UserScreen
