import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from "react-native-toast-message";
import ProfileScreen from './src/screens/ProfileScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainDrawer from './src/navigation/MainDrawer'
import MainBottomTabs from './src/navigation/MainBottomTabs'
import AuthTopTabs from './src/navigation/AuthTopTabs'
import NotificationScreen from './src/screens/NotificationScreen'
// import CreateScreen from './src/screens/CreateScreen'
import PostDetailScreen from './src/screens/PostDetailScreen'
import VideoDetailScreen from './src/screens/VideoDetailScreen'
import PostImage from './src/screens/PostImage'
import { AuthProvider } from './src/context/AuthContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PostProvider } from './src/context/PostContext'
import { VideoProvider } from './src/context/VideoContext'
import { ShortProvider } from './src/context/ShortContext'
import ChatScreen from './src/screens/ChatScreen';
import ProfileShortsScreen from './src/screens/ProfileShortsScreen'
import ProfilePostsScreen from './src/screens/ProfilePostsScreen'
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SettingsScreen from './src/screens/SettingsScreen';
import BookmarksScreen from './src/screens/BookmarksScreen';

function App() {
  const Stack = createNativeStackNavigator();
  const { width } = Dimensions.get("window");

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <PostProvider>
          <VideoProvider>
            <ShortProvider>
              <SafeAreaProvider>
                <View style={styles.container}>
                  <NavigationContainer>
                    <Stack.Navigator screenOptions={{
                      headerStyle: {
                        backgroundColor: "#000000"
                      },
                      headerTintColor: "#fff",
                      headerTitleStyle: {
                        fontWeight: "bold",
                        fontSize: 20
                      },
                    }}>
                      <Stack.Screen name="Main" component={MainDrawer} options={{ headerShown: false }} />
                      <Stack.Screen name="Auth" component={AuthTopTabs} options={{ headerShown: false }} />
                      <Stack.Screen name="Profile" component={ProfileScreen} />
                      <Stack.Screen name="Notification" component={NotificationScreen} />
                      {/* <Stack.Screen name="Create" component={CreateScreen} /> */}
                      <Stack.Screen name="Settings" component={SettingsScreen} />
                      <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
                      <Stack.Screen name="Post" component={PostDetailScreen} />
                      <Stack.Screen name="Video" component={VideoDetailScreen} options={{ headerShown: false }} />
                      <Stack.Screen name="PostImage" component={PostImage} />
                      <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
                      <Stack.Screen name="ProfilePosts" component={ProfilePostsScreen} options={{ title: "Posts" }} />
                      <Stack.Screen name="ProfileShorts" component={ProfileShortsScreen} options={{ headerShown: false }} />
                    </Stack.Navigator>
                  </NavigationContainer>
                  <Toast
                    position="top"
                    topOffset={60}
                    config={{
                      success: (props) => (
                        <View style={{
                          width: width * 0.9,
                          alignSelf: "center",
                          backgroundColor: "#1e1e1e",
                          padding: 14,
                          borderRadius: 12,
                          borderLeftWidth: 4,
                          borderLeftColor: "#22c55e"
                        }}>
                          <Text style={{ color: "#22c55e", fontSize: 18, fontWeight: "600" }}>
                            {props.text1}
                          </Text>
                          {props.text2 && (
                            <Text style={{ color: "#ccc", fontSize: 16 }}>
                              {props.text2}
                            </Text>
                          )}
                        </View>
                      ),
                      error: (props) => (
                        <View style={{
                          width: width * 0.9,
                          alignSelf: "center",
                          backgroundColor: "#1e1e1e",
                          padding: 14,
                          borderRadius: 12,
                          borderLeftWidth: 4,
                          borderLeftColor: "#ef4444"
                        }}>
                          <Text style={{ color: "#ef4444", fontSize: 18, fontWeight: "600" }}>
                            {props.text1}
                          </Text>
                          {props.text2 && (
                            <Text style={{ color: "#ccc", fontSize: 16 }}>
                              {props.text2}
                            </Text>
                          )}
                        </View>
                      ),
                    }}
                  />
                </View>
              </SafeAreaProvider>
            </ShortProvider>
          </VideoProvider>
        </PostProvider>
      </AuthProvider>
    </GestureHandlerRootView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default App;
