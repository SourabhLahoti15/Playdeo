import React, { useContext, useEffect, useRef, useState } from 'react'
import Slider from '@react-native-community/slider';
import Video from "react-native-video";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import defaultAvatar from "../utils/defaultAvatar";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import BASE_URL from '../api/api';
import Toast from 'react-native-toast-message';
import { AuthContext } from "../context/AuthContext";
import followUser from '../utils/followUser';
import unfollowUser from '../utils/unfollowUser';

export default function ShortItem({ item, isActive, listHeight, bottomOffset }) {
    const { user, token } = useContext(AuthContext);
    const [userPaused, setUserPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const videoRef = useRef(null);

    // const liked = item.likes?.includes(user?._id);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    // const disliked = item.dislikes?.includes(user?._id);

    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0);

    const [bookmarked, setBookmarked] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        updateStats(item.likes || [], item.dislikes || []);
    }, [item]);

    const updateStats = (likes = [], dislikes = []) => {
        setLiked(likes.includes(user?._id));
        setDisliked(dislikes.includes(user?._id));
        setLikeCount(likes.length);
        setDislikeCount(dislikes.length);
    };

    const likeShort = async () => {
        if (!token) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Login to like short."
            });
            return;
        }
        try {
            const res = await fetch(`${BASE_URL}/api/shorts/${item._id}/like`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updated = await res.json();
            updateStats(updated.likes || [], updated.dislikes || []);
        } catch (error) {
            console.log(error);
        }
    };

    const dislikeShort = async () => {
        if (!token) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Login to dislike short."
            });
            return;
        }
        try {
            const res = await fetch(`${BASE_URL}/api/shorts/${item._id}/dislike`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updated = await res.json();
            updateStats(updated.likes || [], updated.dislikes || []);
        } catch (error) {
            console.log(error);
        }
    };

    const checkBookmarkStatus = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${BASE_URL}/api/bookmarks/short/${item._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            setBookmarked(data.bookmarked);
        } catch (error) {
            console.log(error);
        }
    };

    const bookmarkShort = async () => {
        if (!token) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Login to bookmark short."
            });
            return;
        }
        const prevState = bookmarked;
        setBookmarked(prev => !prev);
        try {
            const res = await fetch(`${BASE_URL}/api/bookmarks/short/${item._id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json();
            setBookmarked(data.bookmarked);
        } catch (error) {
            setBookmarked(prevState);
            console.log(error);
        }
    }

    const checkFollowStatus = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${BASE_URL}/api/follow/status/${item.user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setIsFollowing(data.isFollowing);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkBookmarkStatus();
        checkFollowStatus();
    }, [item._id])

    return (
        <View style={[styles.container, { height: listHeight }]}>
            <Video
                ref={videoRef}
                source={{ uri: `${BASE_URL}/${item.videoUrl}` }}
                style={[styles.video, { height: listHeight }]}
                resizeMode="cover"
                repeat
                paused={!isActive || userPaused}
                onProgress={(data) => setProgress(data.currentTime)}
                onLoad={(data) => setDuration(data.duration)}
            />
            <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setUserPaused(prev => !prev)}
            />
            {userPaused && (
                <View style={styles.playButton}>
                    <MaterialCommunityIcons name="play" size={60} color="white" />
                </View>
            )}
            <Slider
                style={styles.slider}
                pointerEvents="box-none"
                minimumValue={0}
                maximumValue={duration}
                value={progress}
                minimumTrackTintColor="#fff"
                maximumTrackTintColor="gray"
                thumbTintColor="#fff"
                onSlidingComplete={(value) => {
                    videoRef.current.seek(value);
                }}
            />
            <View style={[styles.overlay, { bottom: bottomOffset }]} pointerEvents="box-none">
                <View style={styles.user}>
                    <Image style={styles.profile_pic} source={{ uri: item.user?.profilePic || defaultAvatar(item.user.username) }} />
                    <Text style={styles.username}>{item.user.username}</Text>
                    {!isFollowing ?
                        <Pressable style={styles.follow_btn} onPress={() => followUser(token, item.user._id, setIsFollowing)}>
                            <Text style={styles.follow_btn_text}>Follow</Text>
                        </Pressable>
                        :
                        <Pressable style={styles.follow_btn} onPress={() => unfollowUser(token, item.user._id, setIsFollowing)}>
                            <Text style={styles.follow_btn_text}>Unfollow</Text>
                        </Pressable>
                    }
                </View>
                <Text style={styles.caption} numberOfLines={2}>{item.caption}</Text>
                <View style={styles.footer}>
                    <View style={styles.footer_left}>
                        <View style={styles.footer_btn}>
                            <Pressable onPress={() => likeShort()}>
                                <MaterialCommunityIcons
                                    name={liked ? "thumb-up" : "thumb-up-outline"}
                                    size={28}
                                    color="white"
                                />
                            </Pressable>
                            <Text style={styles.count_text}>{likeCount}</Text>
                        </View>
                        <View style={styles.footer_btn}>
                            <Pressable onPress={() => dislikeShort()}>
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
                    <Pressable style={styles.bookmark} onPress={() => bookmarkShort()}>
                        <MaterialCommunityIcons
                            name={bookmarked ? "bookmark" : "bookmark-outline"}
                            size={28}
                            color="white"
                        />
                    </Pressable>
                </View>
            </View>
        </View>
    );
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
    playButton: {
        position: 'absolute',
        top: '45%',
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 15,
        borderRadius: 50,
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
    slider: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: 2,
    },
});