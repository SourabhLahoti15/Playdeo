import React, { useEffect, useState } from 'react'
import PostsList from '../components/PostsList'
import BASE_URL from '../api/api';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfilePostsScreen = ({ route }) => {
    const { userId, index } = route.params;
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);

    const getUserPosts = async () => {
        const res = await fetch(`${BASE_URL}/api/posts/user/${userId}?page=${page}`);
        const data = await res.json();
        setPosts(prev => [...prev, ...data]);
    }

    useEffect(() => {
        getUserPosts();
    }, [page]);

    return (
        <SafeAreaView edges={["left", "right", "bottom"]}>
            <PostsList posts={posts} index={index} onEndReached={() => setPage(prev => prev + 1)} />
        </SafeAreaView>
    )
}

export default ProfilePostsScreen
