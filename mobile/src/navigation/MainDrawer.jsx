import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import MainBottomTabs from '../navigation/MainBottomTabs'
import SettingsScreen from '../screens/SettingsScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Drawer = createDrawerNavigator();

function CustomDrawer(props) {
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
        <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
            <Pressable style={styles.btn} onPress={() => {
                props.navigation.closeDrawer();
                props.navigation.getParent()?.navigate("Bookmarks");
            }}>
                <Text style={styles.text}>Bookmarks</Text>
            </Pressable>
            <Pressable style={styles.btn}>
                <Text style={styles.text}>About</Text>
            </Pressable>
            <Pressable style={styles.btn} onPress={() => {
                props.navigation.closeDrawer();
                props.navigation.getParent()?.navigate("Settings");
            }}>
                <Text style={styles.text}>Settings</Text>
            </Pressable>
            <Pressable style={[styles.logout_btn, { bottom: insets.bottom }]} onPress={handleLogout}>
                <Text style={styles.logout_text}>Logout</Text>
            </Pressable>
        </DrawerContentScrollView>
    );
}

function MainDrawer() {
    return (
        <Drawer.Navigator
            screenOptions={{ headerShown: false }}
            drawerContent={(props) => <CustomDrawer {...props} />}
        >
            <Drawer.Screen name="Tabs" component={MainBottomTabs} />
        </Drawer.Navigator>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
    },
    btn: {
        padding: 10,
        width: "100%",
        borderBottomWidth: 1,
        borderColor: "gray"
    },
    text: {
        color: "white",
        fontSize: 16
    },
    logout_btn: {
        position: "absolute",
        left: 10,
        right: 10,
        padding: 10,
        backgroundColor: "rgba(255, 0, 0, 0.8)",
        borderRadius: 10,
        alignItems: "center"
    },
    logout_text: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    }
})

export default MainDrawer;