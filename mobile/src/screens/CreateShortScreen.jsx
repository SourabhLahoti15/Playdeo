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
  const [short, setShort] = useState();
  const [caption, setCaption] = useState("");
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
        const short = response.assets[0];
        setShort(short);
      }
    );
  };

  const handlePost = async () => {
    if (!short || !caption) return;
    try {
      setLoading(true);
      const thumbnail = await createThumbnail({
        url: short.uri,
      });
      const formData = new FormData();
      formData.append("short", {
        uri: short.uri,
        type: short.type,
        name: short.fileName || "video.mp4",
      });
      formData.append("thumbnail", {
        uri: thumbnail.path,
        type: "image/png",
        name: "thumbnail.png"
      });
      formData.append("caption", caption);
      const res = await fetch(`${BASE_URL}/api/shorts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      });
      navigation.navigate("Profile", {
        screen: "Shorts"
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!short ? (
        <Pressable style={styles.preview_placeholder} onPress={pickVideo}>
          <Icon name="play-circle-outline" size={60} color="#777" />
          <Text style={styles.preview_text}>Select Short</Text>
        </Pressable>
      ) : (
        <Video
          source={{ uri: short.uri }}
          style={styles.preview}
          controls
          resizeMode="contain"
        />
      )}
      <TextInput
        placeholder="Caption..."
        placeholderTextColor="#888"
        style={styles.caption_input}
        value={caption}
        onChangeText={setCaption}
      />
      <Pressable style={[styles.post_btn, { opacity: short && caption.trim() ? 1 : 0.5 }]} onPress={handlePost} disabled={!short || !caption.trim() || loading}>
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
  caption_input: {
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
