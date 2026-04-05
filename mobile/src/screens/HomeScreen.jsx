import React, { useContext, useEffect, useState } from 'react'
import BASE_URL from '../api/api'
import PostSkeleton from "../skeletons/PostSkeleton"
import { PostContext } from '../context/PostContext'
import PostsList from "../components/PostsList"
import { FlatList, StyleSheet } from 'react-native'

const HomeScreen = () => {
  const { posts, setPosts } = useContext(PostContext);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const getAllPosts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts?page=${page}`);
      const data = await res.json();
      setPosts(prev => [...prev, ...data]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, [page]);

  if (loading) {
    return (
      <FlatList
        data={Array(5).fill(0)}
        style={styles.container}
        keyExtractor={(_, i) => i.toString()}
        renderItem={() => <PostSkeleton />}
      />
    );
  }

  return (
    <PostsList posts={posts} onEndReached={() => setPage(prev => prev + 1)} />
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
})
export default HomeScreen
