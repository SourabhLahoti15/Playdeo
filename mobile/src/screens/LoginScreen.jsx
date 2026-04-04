import React, { useState } from 'react'
import { Pressable, StyleSheet, TextInput, View, Text, KeyboardAvoidingView, Platform } from 'react-native'
import BASE_URL from '../api/api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const LoginScreen = () => {
    const { setUser, setToken } = useContext(AuthContext);
    const navigation = useNavigation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validate = () => {
        let newErrors = {};
        // Username
        if (username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }
        // Password
        const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(password)) {
            newErrors.password =
                "Min 8 chars, 1 uppercase, 1 symbol required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function handleLogin() {
        // if (!validate()) return;
        try {
            const res = await fetch(`${BASE_URL}/api/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });
            const data = await res.json();
            if (!res.ok) {
                setErrors(prev => ({
                    ...prev,
                    [data.field]: data.message
                }));
                return;
            }
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("token", data.token);
            setUser(data.user);
            setToken(data.token);
            navigation.replace("Main");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.glowTop} />
            <View style={styles.glowBottom} />

            <View style={styles.content}>
                <View style={styles.hero}>
                    <Text style={styles.eyebrow}>PLAYDEO</Text>
                    <Text style={styles.title}>Welcome back</Text>
                    <Text style={styles.subtitle}>
                        Sign in to keep up with your posts, messages, and activity.
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputBlock}>
                        <Text style={styles.label}>Username</Text>
                        <View style={styles.inputWrap}>
                            <Icon name="person-outline" size={20} color="#8f98ae" />
                            <View style={styles.separator} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your username"
                                placeholderTextColor="#667085"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                            />
                        </View>
                        {errors.email && (
                            <View style={styles.errorRow}>
                                <Icon name="warning-outline" width={40} size={18} color="#facc15" style={styles.warningIcon} />
                                <Text style={styles.errorText}>{errors.email}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.inputBlock}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputWrap}>
                            <Icon name="lock-closed-outline" size={20} color="#8f98ae" />
                            <View style={styles.separator} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#667085"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                        {errors.email && (
                            <View style={styles.errorRow}>
                                <Icon name="warning-outline" width={40} size={18} color="#facc15" style={styles.warningIcon} />
                                <Text style={styles.errorText}>{errors.email}</Text>
                            </View>
                        )}
                    </View>
                </View>

                <Pressable style={styles.loginBtn} onPress={handleLogin}>
                    <Text style={styles.loginText}>Login</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050816",
        justifyContent: "center",
        paddingHorizontal: 24,
        overflow: "hidden"
    },
    glowTop: {
        position: "absolute",
        top: -90,
        left: -50,
        width: 240,
        height: 240,
        borderRadius: 999,
        backgroundColor: "#16385f"
    },
    glowBottom: {
        position: "absolute",
        right: -90,
        bottom: -90,
        width: 280,
        height: 280,
        borderRadius: 999,
        backgroundColor: "#114b5f"
    },
    content: {
        width: "100%",
        maxWidth: 420,
        alignSelf: "center"
    },
    hero: {
        marginBottom: 34,
        gap: 8
    },
    eyebrow: {
        color: "#7dd3fc",
        letterSpacing: 2.4,
        fontSize: 12,
        fontWeight: "700"
    },
    title: {
        color: "#f8fafc",
        fontSize: 34,
        fontWeight: "800"
    },
    subtitle: {
        color: "#94a3b8",
        fontSize: 15,
        lineHeight: 22,
        maxWidth: 360
    },
    form: {
        gap: 18
    },
    inputBlock: {
        gap: 8
    },
    label: {
        color: "#dbe4f0",
        fontSize: 13,
        fontWeight: "600"
    },
    inputWrap: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 58,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#23314f",
        backgroundColor: "#11182b",
        gap: 12
    },
    separator: {
        width: 1,
        alignSelf: "stretch",
        backgroundColor: "#2d3a57"
    },
    input: {
        flex: 1,
        color: "#fff",
        fontSize: 16
    },
    loginBtn: {
        marginTop: 26,
        minHeight: 56,
        borderRadius: 18,
        backgroundColor: "#67e8f9",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10
    },
    loginText: {
        color: "#03111d",
        fontSize: 18,
        fontWeight: "800"
    },
    footerText: {
        marginTop: 18,
        color: "#7f8aa3",
        fontSize: 13,
        lineHeight: 18
    },
    errorRow: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#11182b"
    },
    errorText: {
        color: "#ff3939",
        fontSize: 14
    },
    warningIcon: {
        paddingLeft: 8,
        alignSelf: "center",
    },
    errorRow: {
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    errorText: {
        color: "#ff3939",
        fontSize: 14
    },
})

export default LoginScreen
