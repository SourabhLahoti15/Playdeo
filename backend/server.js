const express = require("express");
const http = require("http");
const connectDB = require("./config/db");
require('dotenv').config();

const chatSocket = require("./socket/chatSocket");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const followRoutes = require("./routes/followRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const videoRoutes = require("./routes/videoRoutes");
const shortRoutes = require("./routes/shortRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");

const app = express();

app.use(express.json());

connectDB();

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*"
  }
});

chatSocket(io);

app.set("io", io);

app.get("/", (req, res) => {
  res.send("Playdeo API Running");
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/shorts", shortRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
