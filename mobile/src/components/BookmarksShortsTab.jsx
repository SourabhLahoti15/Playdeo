import React, { useContext, useEffect, useState } from "react";
import { Dimensions, FlatList, Image, Pressable, StyleSheet } from "react-native";
import BASE_URL from "../api/api";
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;
const itemSize = windowWidth / 3;

const BookmarksShortsTab = ({ token }) => {
    const [shorts, setShorts] = useState([]);
    const [page, setPage] = useState(1);
    const navigation = useNavigation();

    const getBookmarkedShorts = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/bookmarks/shorts?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            setShorts(prev => [...prev, ...data]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getBookmarkedShorts();
    }, [page]);

    const renderItem = ({ item, index }) => (
        <Pressable onPress={() => (
            navigation.navigate("BookmarksShorts", {
                token,
                index
            })
        )}>
            <Image
                style={styles.image}
                source={{ uri: `${BASE_URL}/${item.thumbnail}` }}
            />
        </Pressable>
    );

    return (
        <FlatList
            data={shorts}
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
        height: itemSize * 2,
        borderWidth: 0.5,
        borderColor: "#ffffff"
    },
});

export default BookmarksShortsTab;
