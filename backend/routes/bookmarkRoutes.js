const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  bookmarkPost,
  getBookmarks,
  checkBookmark,
} = require("../controllers/bookmarkController");

router.put("/:entityType/:entityId", authMiddleware, bookmarkPost);
router.get("/:entityType/:entityId", authMiddleware, checkBookmark);
router.get("/", authMiddleware, getBookmarks);

module.exports = router;