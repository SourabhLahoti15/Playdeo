import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, Dimensions, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BASE_URL from "../api/api";

const windowWidth = Dimensions.get("window").width;
const itemSize = windowWidth / 3;

const ProfilePostsTab = ({ userId }) => {
    const [posts, setPosts] = useState([]);
    const navigation = useNavigation();
    const [page, setPage] = useState(1);

    const getUserPosts = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/posts/user/${userId}?page=${page}`);
            const data = await res.json();
            setPosts(prev => [...prev, ...data]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUserPosts();
    }, [page]);

    const renderItem = ({ item, index }) => (
        <Pressable
            onPress={() => navigation.navigate("ProfilePosts", { userId: userId, index: index })}
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
        backgroundColor: "#000"
    },
    image: {
        width: itemSize,
        height: itemSize,
        borderWidth: 0.5,
        borderColor: "#ffffff"
    },
});

export default ProfilePostsTab
