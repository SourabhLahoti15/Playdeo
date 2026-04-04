import React, { useRef, useState } from "react";
import {
    View,
    Image,
    ScrollView,
    Pressable,
    Text,
    StyleSheet,
    Dimensions
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import BASE_URL from "../api/api";

const windowWidth = Dimensions.get("window").width;

const PostImage = () => {
    const route = useRoute();
    const { images } = route.params;
    const insets = useSafeAreaInsets();
    const imageRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <View style={styles.container}>
            <ScrollView
                ref={imageRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(
                        event.nativeEvent.contentOffset.x /
                        event.nativeEvent.layoutMeasurement.width
                    );
                    setActiveIndex(index);
                }}
            >
                {images.map((img, index) => (
                    <Image
                        key={index}
                        style={styles.post_img}
                        source={{ uri: `${BASE_URL}/${img}` }}
                    />
                ))}
            </ScrollView>
            {images.length > 1 && (
                <View style={[styles.numbers, { bottom: insets.bottom + 10 }]}>
                    {images.map((_, index) => (
                        <Pressable
                            key={index}
                            style={[
                                styles.number_btn,
                                activeIndex === index && styles.active_number_btn
                            ]}
                            onPress={() => {
                                imageRef.current?.scrollTo({
                                    x: index * windowWidth,
                                    animated: true
                                });
                                setActiveIndex(index);
                            }}
                        >
                            <Text
                                style={[
                                    styles.number_text,
                                    activeIndex === index && styles.active_number_text
                                ]}
                            >
                                {index + 1}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },

    post_img: {
        height: "100%",
        width: windowWidth,
        resizeMode: "contain",
    },

    numbers: {
        flexDirection: "row",
    },

    number_btn: {
        flex: 1,
        // width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ffffff50"
    },

    active_number_btn: {
        backgroundColor: "#ffffffa1"
    },

    number_text: {
        fontSize: 15,
        color: "#fff",
        fontWeight: "bold"
    },

    active_number_text: {
        fontSize: 15,
        color: "#000",
        fontWeight: "bold"
    }
});

export default PostImage;