import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native';
import { Image, Pressable } from 'react-native';
import { Text, View } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from '@react-navigation/native';
import { VideoContext } from "../context/VideoContext";
import BASE_URL from "../api/api";
import Video from "react-native-video";
import defaultAvatar from '../utils/defaultAvatar';
import followUser from '../utils/followUser'
import unfollowUser from '../utils/unfollowUser'
import Toast from 'react-native-toast-message';
import useInterstitialAd from '../hooks/useInterstitialAd';

const VideoCard = ({ video, variant = "feed" }) => {
    const { user, token } = useContext(AuthContext);
    const { showAd } = useInterstitialAd();
    const { setVideos } = useContext(VideoContext);

    const navigation = useNavigation();

    const [bookmarked, setBookmarked] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const liked = video?.likes?.includes(user?._id);
    const disliked = video?.dislikes?.includes(user?._id);

    const likeCount = video?.likes?.length || 0;
    const dislikeCount = video?.dislikes?.length || 0;

    useEffect(() => {
        checkBookmarkStatus();
        checkFollowStatus();
    }, [video._id, user, token]);

    const checkBookmarkStatus = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${BASE_URL}/api/bookmarks/video/${video._id}`, {
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
        if (!token) return;
        try {
            const res = await fetch(`${BASE_URL}/api/follow/status/${video.user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setIsFollowing(data.isFollowing);
        } catch (error) {
            console.log(error);
        }
    };

    const likeVideo = async (videoId) => {
        if (!token) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Login to like video."
            });
            return;
        }
        try {
            const res = await fetch(`${BASE_URL}/api/videos/${videoId}/like`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedVideo = await res.json();
            console.log(updatedVideo)
            setVideos(prev =>
                prev.map(v => v._id === videoId ? { ...v, ...updatedVideo } : v)
            );
        } catch (error) {
            console.log(error);
        }
    };

    const dislikeVideo = async (videoId) => {
        if (!token) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Login to dislike video."
            });
            return;
        }
        try {
            const res = await fetch(`${BASE_URL}/api/videos/${videoId}/dislike`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedVideo = await res.json();
            setVideos(prev =>
                prev.map(v => v._id === videoId ? { ...v, ...updatedVideo } : v)
            );
        } catch (error) {
            console.log(error);
        }
    };

    const bookmarkVideo = async (videoId) => {
        if (!token) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Login to bookmark video."
            });
            return;
        }
        const prev = bookmarked;
        setBookmarked(!prev);
        try {
            const res = await fetch(`${BASE_URL}/api/bookmarks/video/${videoId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json();
            console.log(data)
            setBookmarked(data.bookmarked);
        } catch (error) {
            setBookmarked(prev);
            console.log(error);
        }
    }

    return (
        <Pressable style={styles.card} onPress={() => {
            if (variant == "feed") {
                showAd();
                navigation.navigate("Video", { videoId: video._id });
            }
        }}>
            <View style={styles.header}>
                <Pressable style={styles.header_left} onPress={() => navigation.navigate('Profile', {
                    userId: video.user?._id
                })}>
                    <View style={styles.header_left}>
                        <Image style={styles.profile_img} source={{
                            uri: video.user?.profilePic || defaultAvatar(video.user.username)
                        }}></Image>
                        <Text style={styles.username}>{video.user?.username}</Text>
                    </View>
                </Pressable>
                <View style={styles.header_right}>
                    {!isFollowing ?
                        <Pressable style={styles.follow_btn} onPress={() => followUser(token, video.user._id, setIsFollowing)}>
                            <Text style={styles.follow_btn_text}>Follow</Text>
                        </Pressable>
                        :
                        <Pressable style={styles.unfollow_btn} onPress={() => unfollowUser(token, video.user._id, setIsFollowing)}>
                            <Text style={styles.follow_btn_text}>Unfollow</Text>
                        </Pressable>
                    }
                    <Pressable style={styles.more_btn} onPress={() => console.log('Menu pressed')}>
                        <Text style={styles.more_btn_text}>⋮</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.main}>
                {variant === "feed" ? (
                    <Image
                        style={styles.video_thumbnail}
                        source={{ uri: `${BASE_URL}/${video.thumbnail}` }}
                    />
                ) : (
                    <Video
                        source={{ uri: `${BASE_URL}/${video.videoUrl}` }}
                        style={styles.video_player}
                        controls
                        pictureInPicture={true}
                        resizeMode="contain"
                    />
                )}
                {/* <Video
                    source={{ uri: `${BASE_URL}/${video.videoUrl}` }}
                    style={styles.video_player}
                    controls
                    paused={variant === "feed"}
                    resizeMode="contain"
                /> */}
                <Text style={styles.title} numberOfLines={2}>{video.title}</Text>
                {/* <Text style={styles.description} numberOfLines={3}>{video.description}</Text> */}
            </View>
            <View style={styles.footer}>
                <View style={styles.footer_left}>
                    <View style={styles.footer_btn}>
                        <Pressable onPress={() => likeVideo(video._id)}>
                            <MaterialCommunityIcons
                                name={liked ? "thumb-up" : "thumb-up-outline"}
                                size={28}
                                color="white"
                            />
                        </Pressable>
                        <Text style={styles.count_text}>{likeCount}</Text>
                    </View>
                    <View style={styles.footer_btn}>
                        <Pressable onPress={() => dislikeVideo(video._id)}>
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
                                navigation.navigate("Video", { videoId: video._id });
                            }
                        }}>
                            <MaterialCommunityIcons
                                name={variant == "detail" ? "comment" : "comment-outline"}
                                size={28}
                                color="white"
                            />
                        </Pressable>
                        <Text style={styles.count_text}>{video.comments?.length || 0}</Text>
                    </View>
                    <View style={styles.footer_btn}>
                        <Pressable>
                            <MaterialCommunityIcons
                                name="share-outline"
                                size={28}
                                color="white"
                            />
                        </Pressable>
                        <Text style={styles.count_text}>0</Text>
                    </View>
                </View>
                <View style={styles.footer_right}>
                    <Pressable style={styles.bookmark} onPress={() => bookmarkVideo(video._id)}>
                        <MaterialCommunityIcons
                            name={bookmarked ? "bookmark" : "bookmark-outline"}
                            size={30}
                            color="white"
                        />
                    </Pressable>
                </View>
            </View>
        </Pressable>
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
        height: 40,
        width: 40,
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
    video_thumbnail: {
        height: 200,
        backgroundColor: '#333'
    },
    video_player: {
        height: 250,
        backgroundColor: "#000"
    },
    title: {
        padding: 8,
        color: 'white',
        fontSize: 15,
    },
    description: {
        color: "white",
        fontSize: 14,
    },
    main: {
        // gap: 10
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

export default React.memo(VideoCard);
