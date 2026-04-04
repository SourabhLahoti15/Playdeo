const express = require("express");
const upload = require("../middleware/upload");
const router = express.Router();

const { createPost, getAllPosts, getFollowingPosts, likePost, dislikePost, deletePost, updatePost, getPost, getUserPosts } = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, upload.array("images", 10), createPost);
router.get("/", getAllPosts);
router.get("/following", authMiddleware, getFollowingPosts);
router.put("/:id/like", authMiddleware, likePost);
router.put("/:id/dislike", authMiddleware, dislikePost);
router.delete("/:id", authMiddleware, deletePost);
router.put("/:id", authMiddleware, updatePost);
router.get("/:id", getPost);
router.get("/user/:userId", getUserPosts);

module.exports = router;