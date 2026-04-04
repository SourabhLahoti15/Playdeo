import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native'
import BASE_URL from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const RegisterScreen = () => {
    const navigation = useNavigation();
    const { setUser, setToken } = useContext(AuthContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [verifying, setVerifying] = useState(false);

    const validate = () => {
        let newErrors = {};
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = "Invalid email format";
        }
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

    const handleRegister = async () => {
        // if (!validate()) return;
        try {
            const res = await fetch(`${BASE_URL}/api/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
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
            await AsyncStorage.setItem("token", JSON.stringify(data.token));
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
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
                    <Text style={styles.title}>Create account</Text>
                    <Text style={styles.subtitle}>
                        Create your profile and start sharing moments with your community.
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputBlock}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputWrap}>
                            <Icon name="mail-outline" size={20} color="#8f98ae" />
                            <View style={styles.separator} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#667085"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {email.trim().length > 0 && (
                                <>
                                    <View style={styles.separator} />
                                    <Pressable style={styles.verifyBtn}>
                                        <Icon name="checkmark-circle-outline" size={22} color="#8f98ae" />
                                        {/* <Text style={styles.verifyText}>verify</Text> */}
                                    </Pressable>
                                </>
                            )}
                        </View>
                        {errors.email && (
                            <View style={styles.errorRow}>
                                <Icon name="warning-outline" size={18} color="#facc15" style={styles.warningIcon} />
                                <Text style={styles.errorText}>{errors.email}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.inputBlock}>
                        <Text style={styles.label}>Username</Text>
                        <View style={styles.inputWrap}>
                            <Icon name="person-outline" size={20} color="#8f98ae" />
                            <View style={styles.separator} />
                            <TextInput
                                style={styles.input}
                                placeholder="Choose a username"
                                placeholderTextColor="#667085"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.inputBlock}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputWrap}>
                            <Icon name="lock-closed-outline" size={20} color="#8f98ae" />
                            <View style={styles.separator} />
                            <TextInput
                                style={styles.input}
                                placeholder="Create a password"
                                placeholderTextColor="#667085"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                    </View>
                </View>

                <Pressable style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
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
        top: -70,
        right: -20,
        width: 230,
        height: 230,
        borderRadius: 999,
        backgroundColor: "#173b63"
    },
    glowBottom: {
        position: "absolute",
        left: -90,
        bottom: -90,
        width: 290,
        height: 290,
        borderRadius: 999,
        backgroundColor: "#114b5f"
    },
    content: {
        width: "100%",
        maxWidth: 420,
        alignSelf: "center"
    },
    hero: {
        gap: 8,
        marginBottom: 34
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
        gap: 5,
    },
    label: {
        marginBottom: 5,
        color: "#dbe4f0",
        fontSize: 14,
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
    verifyBtn: {
        alignItems: "center"
    },
    verifyText: {
        color: "#dbe5ff"
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
    button: {
        marginTop: 26,
        minHeight: 56,
        borderRadius: 18,
        backgroundColor: "#67e8f9",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10
    },
    buttonText: {
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
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    errorText: {
        color: "#ff3939",
        fontSize: 14
    },
});

export default RegisterScreen
