module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // join room
        socket.on("join_chat", ({ userId, otherUserId }) => {
            const chatId = [userId, otherUserId].sort().join("_");
            socket.join(chatId);
        });

        // typing
        socket.on("typing", ({ userId, otherUserId }) => {
            const chatId = [userId, otherUserId].sort().join("_");
            socket.to(chatId).emit("typing", { userId });
        });

        // disconnect
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};