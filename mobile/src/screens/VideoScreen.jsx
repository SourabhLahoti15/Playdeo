import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, FlatList, TextInput } from 'react-native'
import VideoCard from '../components/VideoCard'
import Icon from 'react-native-vector-icons/Ionicons';
import VideoSkeleton from '../skeletons/VideoSkeleton'
import { useContext } from "react";
import { VideoContext } from "../context/VideoContext";
import BASE_URL from "../api/api";

const VideoScreen = () => {
  const [search, setSearch] = useState('');
  const { videos, setVideos } = useContext(VideoContext);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const getVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/videos?page=${page}`);
      const data = await res.json();
      setVideos(prev => [...prev, ...data]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVideos();
  }, [page]);

  if (loading) {
    return (
      <FlatList
        data={Array(5).fill(0)}
        keyExtractor={(_, i) => i.toString()}
        renderItem={() => <VideoSkeleton />}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.search_container}>
        <Icon name="search-outline" size={22} color="#888" />
        <View style={styles.separator} />
        <TextInput
          placeholder="Search vidoes..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          style={styles.search}
        />
      </View>
      <FlatList
        data={videos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <VideoCard video={item} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  search_container: {
    marginBottom: 10,
    marginHorizontal: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#1c1c1c',
  },
  separator: {
    width: 1,
    height: "100%",
    backgroundColor: 'rgb(140, 140, 140)'
  },
  search: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
})

export default VideoScreen
