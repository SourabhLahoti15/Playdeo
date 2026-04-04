import React, { useEffect, createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const loadUser = async () => {
            const t = await AsyncStorage.getItem("token");
            const u = await AsyncStorage.getItem("user");
            if (t) {
                setToken(t);
            }
            if (u) {
                setUser(JSON.parse(u));
            }
        };
        setIsLoading(false);
        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};