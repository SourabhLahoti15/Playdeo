const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  bookmarkPost,
  getBookmarks,
  checkBookmark,
  getBookmarkedShorts,
  getBookmarkedVideos,
  getBookmarkedPosts,
} = require("../controllers/bookmarkController");

router.get("/:entityType/:entityId", authMiddleware, checkBookmark);
router.put("/:entityType/:entityId", authMiddleware, bookmarkPost);
router.get("/posts", authMiddleware, getBookmarkedPosts);
router.get("/videos", authMiddleware, getBookmarkedVideos);
router.get("/shorts", authMiddleware, getBookmarkedShorts);

module.exports = router;