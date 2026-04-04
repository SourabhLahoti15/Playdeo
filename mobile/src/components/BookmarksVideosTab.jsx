import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BASE_URL from "../api/api";

const windowWidth = Dimensions.get("window").width;
const itemSize = windowWidth / 2;

const BookmarksVideosTab = ({ token }) => {
    const [videos, setVideos] = useState([]);
    const navigation = useNavigation();
    const [page, setPage] = useState(1);

    const getBookmarkedVideos = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/bookmarks/videos?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            setVideos(prev => [...prev, ...data]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getBookmarkedVideos();
    }, [page]);

    const renderItem = ({ item }) => (
        <Pressable
            style={styles.card}
            onPress={() => navigation.navigate("Video", { videoId: item._id })}
        >
            <Image
                style={styles.thumbnail}
                resizeMode="stretch"
                source={{ uri: `${BASE_URL}/${item.thumbnail}` }}
            />
        </Pressable>
    );

    return (
        <FlatList
            data={videos}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            style={styles.container}
            numColumns={2}
            onEndReached={() => setPage(prev => prev + 1)}
            onEndReachedThreshold={0.5}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#000",
    },
    thumbnail: {
        width: itemSize,
        height: itemSize / 1.5,
        backgroundColor: "#222",
        borderWidth: 0.5,
        borderColor: "#ffffff"
    }
});

export default BookmarksVideosTab;