const Message = require("../models/Message");

const getAIResponse = async (text) => {
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "user", content: text }
          ]
        })
      }
    );
    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "AI failed";
    return reply;
  } catch (error) {
    console.error("AI error:", error);
  }
};

exports.sendMessage = async (req, res) => {
    try {
        const senderId = req.user.userId;
        const receiverId = req.params.userId;
        const { text } = req.body;

        const message = new Message({
            sender: senderId,
            receiver: receiverId,
            text
        });
        await message.save();

        const io = req.app.get("io");
        const chatId = [senderId, receiverId].sort().join("_");
        io.to(chatId).emit("receive_message", message);

        if (receiverId === process.env.AI_USER_ID) {
            const aiReply = await getAIResponse(text);
            const aiMessage = new Message({
                sender: process.env.AI_USER_ID,
                receiver: senderId,
                text: aiReply
            });
            await aiMessage.save();
            io.to(chatId).emit("receive_message", aiMessage);
        }
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// exports.sendAIMessage = async (req, res) => {
//     try {
//         const senderId = req.user.userId;
//         const receiverId = "ai_user";
//         const { text } = req.body;
//         const response = await fetch("https://api.openai.com/v1/chat/completions", {
//                 method: "POST",
//                 headers: {
//                     "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     model: "gpt-4o-mini",
//                     messages: [
//                         { role: "user", content: text }
//                     ]
//                 })
//             }
//         );
//         const data = await response.json();
//         const message = data.choices[0].message.content;
//         const io = req.app.get("io");
//         const chatId = [senderId, receiverId].sort().join("_");
//         io.to(chatId).emit("receive_message", message);
//         res.status(201).json(message);
//     } catch (error) {
//         res.status(500).json(error);
//     }
// };

exports.getMessages = async (req, res) => {
    try {
        const userId = req.user.userId;
        const otherUserId = req.params.userId;
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId }
            ]
        })
            .sort({ createdAt: 1 })
            .populate("sender receiver", "-password");
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getChats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const messages = await Message.find({
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        })
            .sort({ createdAt: -1 })
            .populate("sender receiver", "-password");
        const conversations = {};
        messages.forEach(message => {
            const otherUser =
                message.sender._id.toString() === userId
                    ? message.receiver
                    : message.sender;
            const key = otherUser._id.toString();
            if (!conversations[key]) {
                conversations[key] = {
                    user: otherUser,
                    lastMessage: message
                };
            }
        });
        res.json(Object.values(conversations));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;
        const otherUserId = req.params.userId;
        await Message.updateMany(
            {
                sender: otherUserId,
                receiver: userId,
                isRead: false
            },
            {
                isRead: true
            }
        );
        res.json({ message: "Messages marked as read" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};