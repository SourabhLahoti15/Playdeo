import React, { useState, useEffect, useContext } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import BASE_URL from "../api/api";
import PostCard from "../components/PostCard";
import { AuthContext } from '../context/AuthContext'
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { PostContext } from "../context/PostContext";

const PostDetailScreen = ({ route }) => {
    const { postId } = route.params;

    const { token } = useContext(AuthContext);
    const { posts, setPosts } = useContext(PostContext);
    const insets = useSafeAreaInsets();

    const post = posts.find(p => p._id === postId);
    // const [loading, setLoading] = useState(true);
    const [text, setText] = useState("");
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);

    const getComments = async () => {
        try {
            const res = await fetch(
                `${BASE_URL}/api/comments/post/${postId}?page=${page}`
            );
            const data = await res.json();
            setComments(prev => [...prev, ...data]);
        } catch (error) {
            console.log(error);
        }
    };

    const createComment = async () => {
        if (!text.trim()) return;
        try {
            const res = await fetch(`${BASE_URL}/api/comments/post/${postId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    text: text.trim()
                })
            });
            const newComment = await res.json();
            setComments(prev => [newComment, ...prev]);
            setPosts(prev =>
                prev.map(p =>
                    p._id === postId ? { ...p, comments: [...p.comments, newComment] } : p
                )
            );
            setText("");
        } catch (error) {
            console.log(error);
        }
    };

    // useEffect(() => {
    //     if (!post) {
    //         fetchPost();
    //     }
    // }, []);

    useEffect(() => {
        getComments();
    }, [page]);

    const renderComment = ({ item }) => {

        return (
            <View style={styles.comment}>
                <View style={styles.comment_header}>
                    <View style={styles.comment_header_left}>
                        <Image style={styles.profile_pic} source={{ uri: `${item.user?.profilePic || "https://i.pravatar.cc/190"}` }} />
                        <Text style={styles.username_text}>{item.user.username}</Text>
                    </View>
                    <View style={styles.comment_header_right}>
                        <Pressable style={styles.more_btn} onPress={() => console.log('Menu pressed')}>
                            <Text style={styles.more_btn_text}>⋮</Text>
                        </Pressable>
                    </View>
                </View>
                <Text style={styles.comment_text}>{item.text}</Text>
            </View>
        );
    };

    // if (loading) {
    //     return <Loading />
    // }

    return (
        <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
            <FlatList
                data={comments}
                keyExtractor={(item) => item._id}
                renderItem={renderComment}
                ListHeaderComponent={
                    <>
                        <PostCard post={post} variant="detail" />
                        <Text style={styles.comments_text}>Comments</Text>
                    </>
                }
                onEndReached={() => setPage(prev => prev + 1)}
                onEndReachedThreshold={0.5}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
            <View style={[
                styles.input_container,
                { bottom: insets.bottom }
            ]}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a comment..."
                    placeholderTextColor="#888"
                    value={text}
                    onChangeText={setText}
                />
                <View style={styles.separator} />
                <Pressable style={styles.post_comment_btn} onPress={createComment} disabled={!text}>
                    <Icon
                        name="send"
                        size={24}
                        color={text.trim() ? "#00a884" : "#777"}
                    />
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        // gap: 20
    },
    comments_text: {
        marginTop: 10,
        paddingHorizontal: 18,
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    comment: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "gray"
    },
    comment_header: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    comment_header_left: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    comment_header_right: {

    },
    profile_pic: {
        height: 35,
        width: 35,
        backgroundColor: "red",
        borderRadius: 999
    },
    username_text: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    },
    comment_text: {
        paddingLeft: 40,
        color: "white",
        fontSize: 17
    },
    more_btn: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    more_btn_text: {
        color: 'white',
        fontSize: 26,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        backgroundColor: '#1c1c1c'
    },
    input_container: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        height: 45,
        borderRadius: 8,
        backgroundColor: '#1c1c1c',
    },
    separator: {
        width: 1,
        height: "100%",
        backgroundColor: 'rgb(140, 140, 140)'
    },
});

export default PostDetailScreen;
