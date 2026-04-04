import React, { useEffect, useState } from 'react'
import PostsList from '../components/PostsList'
import BASE_URL from '../api/api';
import { SafeAreaView } from 'react-native-safe-area-context';

const BookmarksPostsScreen = ({ route }) => {
    const { token, index } = route.params;
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);

    const getBookmarkedPosts = async () => {
        const res = await fetch(`${BASE_URL}/api/bookmarks/posts?page=${page}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();
        setPosts(prev => [...prev, ...data]);
    }

    useEffect(() => {
        getBookmarkedPosts();
    }, [page]);

    return (
        <SafeAreaView edges={["left", "right", "bottom"]}>
            <PostsList posts={posts} index={index} onEndReached={() => setPage(prev => prev + 1)} />
        </SafeAreaView>
    )
}

export default BookmarksPostsScreen;
