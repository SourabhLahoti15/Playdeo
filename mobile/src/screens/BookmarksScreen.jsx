import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BookmarksPostsTab from '../components/BookmarksPostsTab'
import BookmarksVideosTab from '../components/BookmarksVideosTab'
import BookmarksShortsTab from '../components/BookmarksShortsTab'
import { AuthContext } from '../context/AuthContext';

const TopTab = createMaterialTopTabNavigator();

export default function BookmarksScreen() {
  const { userId, token } = useContext(AuthContext);
  return (
    <View style={{ flex: 1 }}>
      <TopTab.Navigator screenOptions={{
        tabBarStyle: { backgroundColor: '#000' },
        // tabBarIndicatorStyle: { backgroundColor: '#fff' },
        tabBarActiveTintColor: '#fff',
        tabBarLabelStyle: { fontWeight: 'bold' },
      }}>
        <TopTab.Screen name="Posts">
          {() => <BookmarksPostsTab token={token} />}
        </TopTab.Screen>
        <TopTab.Screen name="Videos">
          {() => <BookmarksVideosTab token={token} />}
        </TopTab.Screen>
        <TopTab.Screen name="Shorts">
          {() => <BookmarksShortsTab token={token} />}
        </TopTab.Screen>
      </TopTab.Navigator>
    </View>
  )
}