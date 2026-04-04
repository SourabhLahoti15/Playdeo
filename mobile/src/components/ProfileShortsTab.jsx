import React, { useContext, useEffect, useState } from "react";
import { Dimensions, FlatList, Image, Pressable, StyleSheet } from "react-native";
import BASE_URL from "../api/api";
import ShortsList from "./ShortsList"
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;
const itemSize = windowWidth / 3;

const ProfileShortsTab = ({ userId }) => {
    const [userShorts, setUserShorts] = useState([]);
    const [page, setPage] = useState(1);
    const navigation = useNavigation();

    const getUserShorts = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/shorts/user/${userId}?page=${page}`);
            const data = await res.json();
            setUserShorts(prev => [...prev, ...data]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUserShorts();
    }, [page]);

    const renderItem = ({ item, index }) => (
        <Pressable onPress={() => (
            navigation.navigate("ProfileShorts", {
                userId,
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
            data={userShorts}
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
        height: itemSize * 2,
        borderWidth: 0.5,
        borderColor: "#ffffff"
    },
});

export default ProfileShortsTab;
