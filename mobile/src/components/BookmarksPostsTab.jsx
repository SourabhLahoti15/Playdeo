import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, Dimensions, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BASE_URL from "../api/api";

const windowWidth = Dimensions.get("window").width;
const itemSize = windowWidth / 3;

const BookmarksPostsTab = ({ token }) => {
    const [posts, setPosts] = useState([]);
    const navigation = useNavigation();
    const [page, setPage] = useState(1);

    const getBookmarkedPosts = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/bookmarks/posts?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            setPosts(prev => [...prev, ...data]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getBookmarkedPosts();
    }, [page]);

    const renderItem = ({ item, index }) => (
        <Pressable
            onPress={() => navigation.navigate("BookmarksPosts", { token: token, index: index })}
        >
            <Image
                style={styles.image}
                source={{ uri: `${BASE_URL}/${item.images?.[0]}` }}
            />
        </Pressable>
    );

    return (
        <FlatList
            data={posts}
            renderItem={renderItem}
            style={styles.container}
            keyExtractor={(item) => item._id}
            numColumns={3}
            onEndReached={() => setPage(prev => prev + 1)}
            onEndReachedThreshold={0.5}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
    },
    image: {
        width: itemSize,
        height: itemSize,
        borderWidth: 0.5,
        borderColor: "#ffffff"
    },
});

export default BookmarksPostsTab
