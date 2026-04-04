import React, { useRef, useState, useEffect, useContext } from 'react'
import {
    View,
    FlatList,
    Dimensions,
    StyleSheet,
    Text,
    Pressable,
    Image,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import defaultAvatar from "../utils/defaultAvatar";

import Video from "react-native-video";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BASE_URL from '../api/api';
import Toast from 'react-native-toast-message';

const ShortsList = ({ shorts, setShorts, initialIndex = 0, bottomOffset = 0, onEndReached }) => {
    // const windowHeight = Dimensions.get("window").height;
    const [listHeight, setListHeight] = useState(0);

    const { user, token } = useContext(AuthContext);

    const [currentIndex, setCurrentIndex] = useState(0);

    const [bookmarked, setBookmarked] = useState({});

    const likeShort = async (id) => {
        if (!token) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Login to like short."
            });
            return;
        }
        try {
            const res = await fetch(`${BASE_URL}/api/shorts/${id}/like`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updated = await res.json();
            setShorts(prev =>
                prev.map(s =>
                    s._id === id
                        ? { ...s, ...updated }
                        : s
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const dislikeShort = async (id) => {
        if (!token) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Login to dislike short."
            });
            return;
        }
        try {
            const res = await fetch(`${BASE_URL}/api/shorts/${id}/dislike`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updated = await res.json();
            setShorts(prev =>
                prev.map(s =>
                    s._id === id
                        ? { ...s, ...updated }
                        : s
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const checkBookmark = async (id) => {
        if (!token) return;
        try {
            const res = await fetch(`${BASE_URL}/api/bookmarks/short/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            setBookmarked(prev => ({
                ...prev,
                [id]: data.bookmarked
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const bookmarkShort = async (id) => {
        if (!token) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Login to bookmark short."
            });
            return;
        }
        const prevState = bookmarked;
        setBookmarked(prev => ({
            ...prev,
            [id]: !prevState
        }));
        try {
            const res = await fetch(`${BASE_URL}/api/bookmarks/short/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json();
            setBookmarked(prev => ({
                ...prev,
                [id]: data.bookmarked
            }));
        } catch (error) {
            setBookmarked(prev => ({
                ...prev,
                [id]: !prevState
            }));
            console.log(error);
        }
    }

    useEffect(() => {
        shorts.forEach(s => {
            checkBookmark(s._id);
        });
    }, [shorts]);

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const renderItem = ({ item, index }) => {
        const isActive = index === currentIndex;

        const liked = item.likes?.includes(user?._id);
        const disliked = item.dislikes?.includes(user?._id);

        const likeCount = item.likes?.length || 0;
        const dislikeCount = item.dislikes?.length || 0;

        const isBookmarked = bookmarked[item._id];

        return (
            <View style={[styles.container, { height: listHeight }]}>
                <Video
                    source={{ uri: `${BASE_URL}/${item.videoUrl}` }}
                    style={[styles.video, { height: listHeight }]}
                    resizeMode="cover"
                    repeat
                    // controls
                    paused={!isActive}
                />

                <View style={[styles.overlay, { bottom: bottomOffset }]}>
                    <View style={styles.user}>
                        <Image style={styles.profile_pic} source={{ uri: item.user?.profilePic || defaultAvatar(item.user.username) }} />
                        <Text style={styles.username}>{item.user.username}</Text>
                        <Pressable style={styles.follow_btn}>
                            <Text style={styles.follow_btn_text}>Follow</Text>
                        </Pressable>
                    </View>
                    <Text style={styles.caption} numberOfLines={2}>{item.caption}</Text>
                    <View style={styles.footer}>
                        <View style={styles.footer_left}>
                            <View style={styles.footer_btn}>
                                <Pressable onPress={() => likeShort(item._id)}>
                                    <MaterialCommunityIcons
                                        name={liked ? "thumb-up" : "thumb-up-outline"}
                                        size={28}
                                        color="white"
                                    />
                                </Pressable>
                                <Text style={styles.count_text}>{likeCount}</Text>
                            </View>
                            <View style={styles.footer_btn}>
                                <Pressable onPress={() => dislikeShort(item._id)}>
                                    <MaterialCommunityIcons
                                        name={disliked ? "thumb-down" : "thumb-down-outline"}
                                        size={28}
                                        color="white"
                                    />
                                </Pressable>
                                <Text style={styles.count_text}>{dislikeCount}</Text>
                            </View>
                            {/* <View style={styles.footer_btn}>
                                <Pressable onPress={() => {
                                    if (variant == "feed") {
                                        navigation.navigate("Post", { postId: post._id });
                                    }
                                }}>
                                    <MaterialCommunityIcons
                                        name={variant == "detail" ? "comment" : "comment-outline"}
                                        size={28}
                                        color="white"
                                    />
                                </Pressable>
                                <Text style={styles.count_text}>{post.comments?.length || 0}</Text>
                            </View> */}
                            <View style={styles.footer_btn}>
                                <Pressable>
                                    <MaterialCommunityIcons
                                        name="share-outline"
                                        size={28}
                                        color="white"
                                    />
                                </Pressable>
                                <Text style={styles.count_text}>{0}</Text>
                            </View>
                        </View>
                        <Pressable style={styles.bookmark} onPress={() => bookmarkShort(item._id)}>
                            <MaterialCommunityIcons
                                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                                size={28}
                                color="white"
                            />
                        </Pressable>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View
            style={{ flex: 1 }}
            onLayout={(e) => {
                setListHeight(e.nativeEvent.layout.height);
            }}
        >
            <FlatList
                data={shorts}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                initialScrollIndex={initialIndex}
                getItemLayout={(data, index) => ({
                    length: listHeight,
                    offset: listHeight * index,
                    index,
                })}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "black"
    },

    video: {
        height: "100%",
        width: "100%"
    },

    overlay: {
        position: "absolute",
        left: 0,
        bottom: 0,
        right: 0,
    },
    user: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15
    },
    profile_pic: {
        height: 50,
        width: 50,
        backgroundColor: "#ffffff30",
        borderRadius: 999
    },
    username: {
        color: "#fff",
        fontSize: 18,
        fontWeight: 'bold'
    },
    follow_btn: {
        paddingVertical: 3,
        paddingHorizontal: 12,
        // backgroundColor: '#555555c0',
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 5
    },
    follow_btn_text: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 15
    },

    caption: {
        padding: 5,
        color: "white",
        fontSize: 16
    },

    views: {
        color: "#aaa",
        marginTop: 5
    },
    footer: {
        padding: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        borderTopColor: "gray",
        borderTopWidth: 1,
        borderStyle: "dashed",
    },
    footer_left: {
        flexDirection: "row",
        alignItems: 'center',
        gap: 15
    },
    footer_btn: {
        alignItems: "center"
    },
    count_text: {
        color: "#fff"
    },
});

export default ShortsList
