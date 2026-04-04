import React, { useContext, useState } from 'react'
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from "react-native-vector-icons/Ionicons";
import DraggableFlatList from "react-native-draggable-flatlist";
import { AuthContext } from '../context/AuthContext';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BASE_URL from '../api/api';
import { useNavigation } from '@react-navigation/native';

const CreatePostScreen = () => {
    const { token } = useContext(AuthContext);
    const insets = useSafeAreaInsets();
    const [images, setImages] = useState([]);
    const [caption, setCaption] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const pickImages = () => {
        launchImageLibrary(
            {
                mediaType: "photo",
                selectionLimit: 10
            },
            response => {
                if (response.assets) {
                    setImages(prev => [...prev, ...response.assets]);
                }
            }
        );
    };
    const removeImage = index => {
        setImages(prev => {
            const updated = prev.filter((_, i) => i !== index);
            setActiveIndex(Math.max(0, index - 1));
            return updated;
        });
    };
    const handlePost = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("caption", caption);
            images.forEach((img, index) => {
                formData.append("images", {
                    uri: img.uri,
                    type: img.type,
                    name: img.fileName || `image_${index}.jpg`
                });
            });
            const res = await fetch(`${BASE_URL}/api/posts`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });
            const data = await res.json();
            setCaption("");
            setImages([]);
            navigation.navigate("Profile", {
                screen: "Posts"
            });
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <View style={styles.container}>
            {images.length === 0 ? (
                <View style={styles.preview_placeholder}>
                    <Icon name="image-outline" size={60} color="#777" />
                    <Text style={styles.preview_text}>No image selected</Text>
                </View>
            ) : (
                <Image
                    source={{ uri: images[activeIndex].uri }}
                    style={styles.preview}
                />
            )}
            <DraggableFlatList
                data={images}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, drag, isActive, getIndex }) => (
                    <Pressable
                        onLongPress={drag}
                        disabled={isActive}
                        onPress={() => setActiveIndex(getIndex())}
                        style={[styles.image_btn, activeIndex === getIndex() && styles.active_img_btn]}
                    >
                        <Pressable
                            style={styles.remove_btn}
                            onPress={() => removeImage(getIndex())}
                        >
                            <Icon name="close" size={16} color="white" />
                        </Pressable>
                        <Image source={{ uri: item.uri }} style={styles.image} />
                    </Pressable>
                )}
                onDragEnd={({ data, from, to }) => {
                    setImages(data)
                    if (activeIndex === from) {
                        setActiveIndex(to);
                    }
                }}
                ListHeaderComponent={
                    <Pressable style={styles.add_image} onPress={pickImages}>
                        <Icon name="add" size={35} color="white" />
                    </Pressable>
                }
            />
            <TextInput
                placeholder="Write something..."
                placeholderTextColor="#888"
                style={styles.input}
                multiline
                value={caption}
                onChangeText={setCaption}
            />
            <Pressable style={[styles.post_btn, { opacity: images && caption ? 1 : 0.5 }]} onPress={handlePost} disabled={!images || !caption || loading}>
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
    remove_btn: {
        zIndex: 1,
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "black",
        borderRadius: 12,
        padding: 4
    },
    add_image: {
        marginRight: 10,
        width: 120,
        height: 120,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#555",
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        padding: 10,
        color: "white",
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#555",
        borderRadius: 10
    },
    image_btn: {
        marginRight: 10,
        width: 120,
        height: 120,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    },
    active_img_btn: {
        borderWidth: 2,
        borderColor: "#1e90ff"
    },
    image: {
        width: "100%",
        height: "100%"
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
export default CreatePostScreen
