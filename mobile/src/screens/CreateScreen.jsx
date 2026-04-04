import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import { StyleSheet, View } from 'react-native'
import CreatePostScreen from './CreatePostScreen'
import CreateVideoScreen from './CreateVideoScreen'
import CreateShortScreen from './CreateShortScreen'

const TopTab = createMaterialTopTabNavigator();

const CreateScreen = () => {
    return (
        <View style={styles.container}>
            <TopTab.Navigator
                screenOptions={{
                    tabBarStyle: { backgroundColor: "#000" },
                    tabBarActiveTintColor: "#fff",
                    tabBarIndicatorStyle: { backgroundColor: "#3a9ead" }
                }}
            >
                <TopTab.Screen name="Post" component={CreatePostScreen} />
                <TopTab.Screen name="Video" component={CreateVideoScreen} />
                <TopTab.Screen name="Shorts" component={CreateShortScreen} />
            </TopTab.Navigator>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
})

export default CreateScreen
