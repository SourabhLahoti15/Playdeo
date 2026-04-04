const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { sendMessage, getMessages, getChats, markAsRead } = require("../controllers/messageController");

router.post("/:userId", authMiddleware, sendMessage);
router.get("/:userId", authMiddleware, getMessages);
router.get("/", authMiddleware, getChats);
router.put("/:userId/read", authMiddleware, markAsRead);

module.exports = router;