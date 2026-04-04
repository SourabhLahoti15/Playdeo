import io from "socket.io-client";
import BASE_URL from "../api/api";

const socket = io(BASE_URL);

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});

export default socket;