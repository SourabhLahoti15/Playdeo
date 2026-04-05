import React, { useEffect } from 'react'
import PostCard from "../components/PostCard"
import { FlatList } from 'react-native'
import { useRef } from "react";
import AdBanner from './AdBanner'
// import AdNative from './AdNative'

const PostsList = ({ posts, index = 0, onEndReached }) => {
    const flatListRef = useRef(null);
    useEffect(() => {
        if (posts.length > index) {
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                    index: index,
                    animated: true,
                });
            }, 100);
        }
    }, [posts]);
    const renderPost = ({ item, index }) => (
        <>
            <PostCard post={item} variant="feed" />
            {(index + 1) % 5 === 0 && (
                <AdBanner />
            )}
        </>
    );
    return (
        <FlatList
            ref={flatListRef}
            data={posts}
            keyExtractor={(item) => item._id}
            renderItem={renderPost}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            onScrollToIndexFailed={(info) => {
                setTimeout(() => {
                    flatListRef.current?.scrollToIndex({
                        index: info.index,
                        animated: true,
                    });
                }, 300);
            }}
        />
    )
}

export default PostsList;
