import HomeScreen from '../screens/HomeScreen';
import CreateScreen from '../screens/CreateScreen'
import VideoScreen from '../screens/VideoScreen';
import ShortsScreen from '../screens/ShortsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ChatsScreen from '../screens/ChatsScreen';

const HomeTabBarIcon = ({ color, size }) => (
    <Icon name="home-outline" color={color} size={size} />
);

const VideoTabBarIcon = ({ color, size }) => (
    <Icon name="videocam-outline" color={color} size={size} />
);

const CreateTabBarIcon = ({ color, size }) => (
    <Icon name="add" color={color} size={size} />
);

const ShortsTabBarIcon = ({ color, size }) => (
    <Icon name="play-circle-outline" color={color} size={size} />
);

const ChatsTabBarIcon = ({ color, size }) => (
    <Icon name="chatbubble-ellipses-outline" color={color} size={size} />
);

const HeaderLeft = () => {
    const navigation = useNavigation();
    return (
        <Pressable style={styles.header_left} onPress={() => navigation.openDrawer()}>
            <Icon name="menu" size={28} color="#fff" />
        </Pressable>
    );
}

const HeaderRight = () => {
    const navigation = useNavigation();
    const { token } = useContext(AuthContext);

    const handleUserPress = async () => {
        if (token) {
            navigation.navigate("User");
        } else {
            navigation.navigate("Auth");
        }
    };
    const isDark = true;
    return (
        <View style={styles.header_right}>
            <Icon name={isDark ? "sunny" : "moon"} size={30} color="white"/>
            <Pressable>
                <Icon name="notifications-outline" size={30} color="#fff" />
            </Pressable>
            <Pressable onPress={handleUserPress}>
                <Icon name="person-circle-outline" size={30} color="#fff" />
            </Pressable>
        </View>
    );
};

function MainTabs() {
    const BottomTab = createBottomTabNavigator();
    return (
        <BottomTab.Navigator
            screenOptions={{
                headerStyle: styles.bottom_tab_header,
                headerTintColor: '#fff',
                headerLeft: HeaderLeft,
                headerRight: HeaderRight,
                tabBarStyle: {
                    backgroundColor: '#000',
                },
            }}
        >
            <BottomTab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: HomeTabBarIcon,
                    headerTitle: 'Home',
                }}
            />
            <BottomTab.Screen
                name="Videos"
                component={VideoScreen}
                options={{
                    tabBarIcon: VideoTabBarIcon,
                    headerTitle: 'Videos',
                }}
            />
            <BottomTab.Screen
                name="Create"
                component={CreateScreen}
                options={{
                    tabBarIcon: CreateTabBarIcon,
                    headerTitle: "Create"
                }}
            // listeners={({ navigation }) => ({
            //     tabPress: e => {
            //         e.preventDefault();
            //         navigation.getParent().navigate("Create");
            //     }
            // })}
            />
            <BottomTab.Screen
                name="Shorts"
                component={ShortsScreen}
                options={{
                    tabBarIcon: ShortsTabBarIcon,
                    headerShown: false,
                }}
            />
            <BottomTab.Screen
                name="Chats"
                component={ChatsScreen}
                options={{
                    tabBarIcon: ChatsTabBarIcon,
                }}
            />
        </BottomTab.Navigator>
    );
}

const styles = StyleSheet.create({
    bottom_tab_header: {
        backgroundColor: '#000',
        borderBottomWidth: 0,
        shadowColor: 'transparent',
    },
    header_right: {
        marginRight: 16,
        flexDirection: 'row',
        gap: 16,
    },
    header_left: {
        marginLeft: 16,
    },
    videos_header_right: {
        marginRight: 16,
        flexDirection: 'row',
        gap: 16,
    }
})

export default MainTabs;
