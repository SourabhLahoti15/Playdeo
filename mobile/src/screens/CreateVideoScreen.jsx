import React, { useContext, useState } from 'react'
import { Pressable, StyleSheet, View, Text, TextInput } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import BASE_URL from '../api/api';
import { createThumbnail } from "react-native-create-thumbnail";

const CreateVideoScreen = () => {
  const { token } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const [video, setVideo] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const pickVideo = () => {
    launchImageLibrary(
      {
        mediaType: "video",
        videoQuality: "low",
        selectionLimit: 1
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled picker");
          return;
        }
        if (response.errorCode) {
          console.log("Picker error:", response.errorMessage);
          return;
        }
        const video = response.assets[0];
        setVideo(video);
      }
    );
  };

  const handlePost = async () => {
    if (!video || !title || !description) return;
    try {
      setLoading(true);
      const thumbnail = await createThumbnail({
        url: video.uri,
      });
      const formData = new FormData();
      formData.append("video", {
        uri: video.uri,
        type: video.type,
        name: video.name || "video.mp4",
      });
      formData.append("thumbnail", {
        uri: thumbnail.path,
        type: "image/png",
        name: "thumbnail.png"
      });
      formData.append("title", title);
      formData.append("description", description);
      const res = await fetch(`${BASE_URL}/api/videos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      });
      navigation.navigate("Profile", {
        screen: "Videos"
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!video ? (
        <Pressable style={styles.preview_placeholder} onPress={pickVideo}>
          <Icon name="videocam-outline" size={60} color="#777" />
          <Text style={styles.preview_text}>Select Video</Text>
        </Pressable>
      ) : (
        <Video
          source={{ uri: video.uri }}
          style={styles.preview}
          controls
          resizeMode="contain"
        />
      )}
      <TextInput
        placeholder="Title..."
        placeholderTextColor="#888"
        style={styles.title_input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Description..."
        placeholderTextColor="#888"
        style={styles.description_input}
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <Pressable style={[styles.post_btn, { opacity: video && title.trim() && description.trim() ? 1 : 0.5 }]} onPress={handlePost} disabled={!video || !title.trim() || !description.trim() || loading}>
        <Text style={styles.post_text}>Post</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    gap: 15
  },
  preview: {
    width: "100%",
    height: 250,
    resizeMode: "cover"
  },
  preview_placeholder: {
    width: "100%",
    height: 250,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#333"
  },
  preview_text: {
    color: "#777",
    marginTop: 10,
    fontSize: 16
  },
  title_input: {
    padding: 10,
    color: "white",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 10
  },
  description_input: {
    padding: 10,
    color: "white",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 10
  },
  post_btn: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    marginHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#1e90ff",
    alignItems: "center",

  },
  post_text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  }
})

export default CreateVideoScreen
