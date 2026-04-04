import React, { useState, useRef, useEffect } from 'react'
import { Image, Pressable, StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from '../api/api';
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { PostContext } from "../context/PostContext";
import defaultAvatar from '../utils/defaultAvatar'
import followUser from '../utils/followUser'
import unfollowUser from '../utils/unfollowUser'

const windowWidth = Dimensions.get("window").width;

const PostCard = ({ post, variant }) => {
    const { user, token } = useContext(AuthContext);
    const { setPosts } = useContext(PostContext);

    const navigation = useNavigation();

    const [isFollowing, setIsFollowing] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    const liked = post.likes?.includes(user?._id);
    const disliked = post.dislikes?.includes(user?._id);

    const likeCount = post.likes?.length || 0;
    const dislikeCount = post.dislikes?.length || 0;

    useEffect(() => {
        checkBookmarkStatus();
        checkFollowStatus();
    }, [post._id, user, token]);

    const [shareCount, setShareCount] = useState(post.shares?.length || 0);

    const [activeIndex, setActiveIndex] = useState(0);
    const imageRef = useRef(null);
    // const imagewidthRef = useRef(0);

    const checkBookmarkStatus = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/bookmarks/post/${post._id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            setBookmarked(data.bookmarked);
        } catch (error) {
            console.log('Error checking bookmark status:', error);
        }
    };

    const checkFollowStatus = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/follow/status/${post.user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setIsFollowing(data.isFollowing);
        } catch (error) {
            console.log(error);
        }
    };

    const likePost = async (postId) => {
        try {
            const res = await fetch(`${BASE_URL}/api/posts/${postId}/like`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedPost = await res.json();
            setPosts(prev =>
                prev.map(p => p._id === postId ? { ...p, ...updatedPost } : p)
            );
        } catch (error) {
            console.log(error);
        }
    }

    const dislikePost = async (postId) => {
        try {
            const res = await fetch(`${BASE_URL}/api/posts/${postId}/dislike`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedPost = await res.json();
            setPosts(prev =>
                prev.map(p => p._id === postId ? { ...p, ...updatedPost } : p)
            );
        } catch (error) {
            console.log(error);
        }
    }

    const bookmarkPost = async (postId) => {
        const prev = bookmarked;
        setBookmarked(!prev);
        try {
            const res = await fetch(`${BASE_URL}/api/bookmarks/post/${postId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json();
            setBookmarked(data.bookmarked);
        } catch (error) {
            setBookmarked(prev);
            console.log(error);
        }
    }

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Pressable style={styles.header_left} onPress={() => navigation.navigate('Profile', {
                    userId: post.user?._id
                })}>
                    <Image style={styles.profile_img} source={{
                        uri: post.user?.profilePic || defaultAvatar(post.user?.username)
                    }}
                    />
                    <Text style={styles.username}>{post.user?.username}</Text>
                </Pressable>
                <View style={styles.header_right}>
                    {!isFollowing ?
                        <Pressable style={styles.follow_btn} onPress={() => followUser(token, post.user._id, setIsFollowing)}>
                            <Text style={styles.follow_btn_text}>Follow</Text>
                        </Pressable>
                        :
                        <Pressable style={styles.unfollow_btn} onPress={() => unfollowUser(token, post.user._id, setIsFollowing)}>
                            <Text style={styles.follow_btn_text}>Unfollow</Text>
                        </Pressable>
                    }
                    <Pressable style={styles.more_btn} onPress={() => console.log('Menu pressed')}>
                        <Text style={styles.more_btn_text}>⋮</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.main}>
                {post.images?.length > 0 && (
                    <ScrollView
                        ref={imageRef}
                        horizontal
                        pagingEnabled
                        onMomentumScrollEnd={(event) => {
                            const index = Math.round(
                                event.nativeEvent.contentOffset.x /
                                event.nativeEvent.layoutMeasurement.width
                            );
                            setActiveIndex(index);
                        }}
                    >
                        {post.images.map((img, index) => (
                            <Pressable
                                key={index}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    navigation.navigate("PostImage", { images: post.images });
                                }}
                            >
                                <Image
                                    style={styles.post_img}
                                    source={{ uri: `${BASE_URL}/${img}` }}
                                />
                            </Pressable>
                        ))}
                    </ScrollView>
                )}
                {post.images?.length > 1 && (
                    <View style={styles.numbers}>
                        {post.images.map((img, index) => (
                            <Pressable
                                key={index}
                                style={[
                                    styles.number_btn,
                                    activeIndex === index && styles.active_number_btn
                                ]}
                                onPress={() => {
                                    imageRef.current?.scrollTo({
                                        x: index * windowWidth,
                                        animated: true
                                    });
                                    setActiveIndex(index);
                                }}
                            >
                                <Text style={[styles.number_text, activeIndex === index && styles.active_number_text]}>{index + 1}</Text>
                            </Pressable>
                        ))}
                    </View>
                )}
                <Text style={styles.caption}>{post.caption}</Text>
            </View>
            <Pressable onPress={() => {
                if (variant == "feed") {
                    navigation.navigate("Post", { postId: post._id });
                }
            }} style={styles.footer}>
                <View style={styles.footer_left}>
                    <View style={styles.footer_btn}>
                        <Pressable onPress={() => likePost(post._id)}>
                            <MaterialCommunityIcons
                                name={liked ? "thumb-up" : "thumb-up-outline"}
                                size={28}
                                color="white"
                            />
                        </Pressable>
                        <Text style={styles.count_text}>{likeCount}</Text>
                    </View>
                    <View style={styles.footer_btn}>
                        <Pressable onPress={() => dislikePost(post._id)}>
                            <MaterialCommunityIcons
                                name={disliked ? "thumb-down" : "thumb-down-outline"}
                                size={28}
                                color="white"
                            />
                        </Pressable>
                        <Text style={styles.count_text}>{dislikeCount}</Text>
                    </View>
                    <View style={styles.footer_btn}>
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
                    </View>
                    <View style={styles.footer_btn}>
                        <Pressable>
                            <MaterialCommunityIcons
                                name="share-outline"
                                size={28}
                                color="white"
                            />
                        </Pressable>
                        <Text style={styles.count_text}>{shareCount}</Text>
                    </View>
                </View>
                <View style={styles.footer_right}>
                    <Pressable style={styles.bookmark} onPress={() => bookmarkPost(post._id)}>
                        <MaterialCommunityIcons
                            name={bookmarked ? "bookmark" : "bookmark-outline"}
                            size={28}
                            color="white"
                        />
                    </Pressable>
                </View>
            </Pressable>
        </View>
    )
}
const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: '#000',
        borderBottomWidth: 1,
        borderColor: 'gray'
    },
    header: {
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 5
    },
    header_left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    header_right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    profile_img: {
        height: 50,
        width: 50,
        backgroundColor: "#ffffff30",
        borderRadius: 999
    },
    username: {
        color: "#fff",
        fontSize: 16,
        fontWeight: '500'
    },
    follow_btn: {
        paddingVertical: 3,
        paddingHorizontal: 12,
        backgroundColor: '#555555c0',
        borderRadius: 5
    },
    unfollow_btn: {
        paddingVertical: 3,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5
    },
    follow_btn_text: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 15
    },
    more_btn: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    more_btn_text: {
        color: 'white',
        fontSize: 26,
    },
    post_img: {
        height: 300,
        width: windowWidth,
        backgroundColor: '#333'
    },
    caption: {
        padding: 8,
        color: 'white',
        fontSize: 15,
    },
    main: {
        // gap: 10
    },
    numbers: {
        flexDirection: "row",
        justifyContent: "center",
    },
    number_btn: {
        flex: 1,
        // width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ffffff50"
    },
    active_number_btn: {
        backgroundColor: "#ffffffa1"
    },
    number_text: {
        fontSize: 15,
        color: "#ffffff",
        fontWeight: "bold"
    },
    active_number_text: {
        fontSize: 15,
        color: "#000",
        fontWeight: "bold"
    },
    footer: {
        paddingVertical: 5,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderStyle: "dashed",
        borderTopColor: "gray",
    },
    footer_left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    footer_btn: {
        alignItems: "center"
    },
    count_text: {
        color: "#fff"
    },
})
export default React.memo(PostCard)
