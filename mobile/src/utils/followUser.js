import Toast from "react-native-toast-message";
import BASE_URL from "../api/api";

const followUser = async (token, userId, setIsFollowing) => {
    try {
        const res = await fetch(`${BASE_URL}/api/follow/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();
        if (!res.ok) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: data.message
            });
            return;
        }
        setIsFollowing(data.isFollowing);
    } catch (error) {
        console.error(error);
    }
}

export default followUser;