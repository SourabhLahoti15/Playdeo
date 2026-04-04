const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createVideo,
    getAllVideos,
    getFollowingVideos,
    likeVideo,
    dislikeVideo,
    addVideoView,
    getUserVideos
} = require("../controllers/videoController");
const upload = require("../middleware/upload");

router.post("/", authMiddleware, upload.fields([{ name: "video", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), createVideo);
router.get("/", getAllVideos);
router.get("/following", authMiddleware, getFollowingVideos);
router.put("/:id/like", authMiddleware, likeVideo);
router.put("/:id/dislike", authMiddleware, dislikeVideo);
router.put("/:id/view", addVideoView);
router.get("/user/:userId", getUserVideos);

module.exports = router;