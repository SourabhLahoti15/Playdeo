import React, { useContext, useEffect, useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import BASE_URL from '../api/api';
import defaultAvatar from '../utils/defaultAvatar';
import ProfilePostsTab from '../components/ProfilePostsTab';
import ProfileVideosTab from '../components/ProfileVideosTab';
import ProfileShortsTab from '../components/ProfileShortsTab';
import followUser from '../utils/followUser';
import unfollowUser from '../utils/unfollowUser';

const TopTab = createMaterialTopTabNavigator();

const ProfileScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;
  const { user, token } = useContext(AuthContext);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const isOwnProfile = user._id === userId;

  const getProfileUser = async () => {
    const res = await fetch(`${BASE_URL}/api/users/${userId}`);
    const data = await res.json();
    setProfileUser(data);
  };
  const getFollowersCount = async () => {
    const res = await fetch(`${BASE_URL}/api/follow/followers/count/${userId}`)
    const data = await res.json();
    setFollowersCount(data.count);
  };
  const getFollowingCount = async () => {
    const res = await fetch(`${BASE_URL}/api/follow/following/count/${userId}`)
    const data = await res.json();
    setFollowingCount(data.count);
  };
  const checkFollowStatus = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/follow/status/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setIsFollowing(data.isFollowing);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProfileUser();
    getFollowersCount();
    getFollowingCount();
    checkFollowStatus();
  }, [userId]);

  useEffect(() => {
    getFollowersCount();
  }, [isFollowing]);

  return (
    <View style={styles.container}>
      {/* <View style={styles.header_container}>
        <View style={styles.header_left}>
          <Icon
            name="arrow-back"
            size={24}
            color="#fff"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.header_title}>Profile</Text>
        </View>
        <Icon
          name="ellipsis-vertical"
          size={24}
          color="#fff"
        />
      </View> */}
      <View style={styles.profile}>
        <View style={styles.img_name}>
          <Image style={styles.profile_img} source={{
            uri: profileUser?.profilePic || defaultAvatar(profileUser?.username)
          }} />
          <Text style={styles.username_text}>{profileUser?.username}</Text>
        </View>
        <View style={styles.follow_stats}>
          <View style={styles.followers}>
            <Text style={styles.followers_text}>Followers</Text>
            <Text style={styles.followers_count}>{followersCount}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.following}>
            <Text style={styles.following_text}>Following</Text>
            <Text style={styles.following_count}>{followingCount}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.about_text} numberOfLines={3}>{profileUser?.bio}</Text>
      {!isOwnProfile && (
        <View style={styles.btns}>
          {!isFollowing ?
            <Pressable style={styles.follow_btn} onPress={() => followUser(token, userId, setIsFollowing)}>
              <Text style={styles.follow_btn_text}>Follow</Text>
            </Pressable>
            :
            <Pressable style={styles.unfollow_btn} onPress={() => unfollowUser(token, userId, setIsFollowing)}>
              <Text style={styles.follow_btn_text}>Unfollow</Text>
            </Pressable>
          }
          <Pressable style={styles.message_btn} onPress={() => (navigation.navigate("Chat", { otherUser: profileUser }))}>
            <Text style={styles.message_btn_text}>Message</Text>
          </Pressable>
        </View>
      )}
      <View style={styles.posts}>
        <TopTab.Navigator screenOptions={{
          tabBarStyle: { backgroundColor: '#000' },
          // tabBarIndicatorStyle: { backgroundColor: '#fff' },
          tabBarActiveTintColor: '#fff',
          tabBarLabelStyle: { fontWeight: 'bold' },
        }}>
          <TopTab.Screen name="Posts">
            {() => <ProfilePostsTab userId={userId} />}
          </TopTab.Screen>
          <TopTab.Screen name="Videos">
            {() => <ProfileVideosTab userId={userId} />}
          </TopTab.Screen>
          <TopTab.Screen name="Shorts">
            {() => <ProfileShortsTab userId={userId} />}
          </TopTab.Screen>
        </TopTab.Navigator>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  // header_container: {
  //   flexDirection: 'row',
  //   alignSelf: 'stretch',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   backgroundColor: '#000'
  // },
  // header_left: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   gap: 10
  // },
  // header_title: {
  //   color: '#fff',
  //   fontSize: 18,
  //   fontWeight: 'bold'
  // },
  profile: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  profile_img: {
    height: 100,
    width: 100,
    borderRadius: 999,
    backgroundColor: "#ffffff30"
  },
  username_text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  },
  img_name: {
    alignItems: 'center',
    gap: 8
  },
  follow_stats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  followers: {
    alignItems: 'center'
  },
  followers_text: {
    fontWeight: 'bold',
    fontSize: 17,
    color: 'white'
  },
  followers_count: {
    color: 'white',
    fontSize: 18,
  },
  separator: {
    width: 1,
    height: 45,
    backgroundColor: '#fff'
  },
  following: {
    alignItems: 'center'
  },
  following_text: {
    fontWeight: 'bold',
    fontSize: 17,
    color: 'white'
  },
  following_count: {
    fontSize: 18,
    color: 'white'
  },
  about_text: {
    paddingHorizontal: 20,
    color: '#fff',
    fontSize: 17
  },
  btns: {
    marginVertical: 10,
    paddingHorizontal: 20,
    gap: 10,
    flexDirection: "row"
  },
  follow_btn: {
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#335282c0',
    borderRadius: 5,
    width: "50%"
  },
  unfollow_btn: {
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    width: "50%"
  },
  follow_btn_text: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 15
  },
  message_btn: {
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#424242c0',
    borderRadius: 5,
    width: "50%"
  },
  message_btn_text: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 15
  },
  posts: {
    flex: 1
  }
})
export default ProfileScreen
