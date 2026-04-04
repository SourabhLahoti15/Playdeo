import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from "react-native-safe-area-context";

const TopTap = createMaterialTopTabNavigator();

const AuthTabs = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050816" }}>
            <TopTap.Navigator
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: "#050816",
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 1,
                        borderBottomColor: "#172033",
                    },
                    tabBarLabelStyle: {
                        fontSize: 13,
                        fontWeight: "700",
                        textTransform: "none",
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: "#67e8f9",
                        height: 3,
                        borderRadius: 999,
                    },
                    tabBarActiveTintColor: "#f8fafc",
                    tabBarInactiveTintColor: "#6b7280",
                    sceneStyle: {
                        backgroundColor: "#050816",
                    }
                }}
            >
                <TopTap.Screen name="Register" component={RegisterScreen} />
                <TopTap.Screen name="Login" component={LoginScreen} />
            </TopTap.Navigator>
        </SafeAreaView >
    );
}

export default AuthTabs;