import React, { useContext, useEffect, useState } from "react";
import { View, FlatList, Image, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import BASE_URL from "../api/api";

const windowWidth = Dimensions.get("window").width;

const ProfileVideosTab = ({ userId }) => {
    const [videos, setVideos] = useState([]);
    const navigation = useNavigation();
    const [page, setPage] = useState(1);

    const getUserVideos = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/videos/user/${userId}?page=${page}`);
            const data = await res.json();
            setVideos(prev => [...prev, ...data]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUserVideos();
    }, [page]);

    const renderItem = ({ item }) => (
        <Pressable
            style={styles.card}
            onPress={() => navigation.navigate("Video", { videoId: item._id })}
        >
            <Image
                style={styles.thumbnail}
                source={{ uri: `${BASE_URL}/${item.thumbnail}` }}
            />
            <View style={styles.info}>
                <Text numberOfLines={2} style={styles.title}>
                    {item.title}
                </Text>
                <Text numberOfLines={3} style={styles.description}>
                    {item.description}
                </Text>
                <Text style={styles.view}>
                    {item.views || 0} views
                </Text>
            </View>
        </Pressable>
    );

    return (
        <FlatList
            data={videos}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            style={styles.videos}
            onEndReached={() => setPage(prev => prev + 1)}
            onEndReachedThreshold={0.5}
        />
    )
}

const styles = StyleSheet.create({
    videos: {
        backgroundColor: "#000"
    },
    card: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "gray",
        alignItems: "center"
    },
    thumbnail: {
        width: "40%",
        height: "80%",
        backgroundColor: "#222",
        borderRadius: 10
    },

    info: {
        padding: 10
    },

    title: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    },
    description: {
        color: "#fff",
        fontSize: 14,
    },

    view: {
        color: "#aaa",
        marginTop: 4
    }
});

export default ProfileVideosTab;