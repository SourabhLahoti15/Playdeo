const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { followUser, unfollowUser, getFollowers, getFollowing, getFollowersCount, getFollowingCount, checkFollowStatus } = require("../controllers/followController");

router.get("/status/:userId", authMiddleware, checkFollowStatus);

router.post("/:userId", authMiddleware, followUser);

router.delete("/:userId", authMiddleware, unfollowUser);

router.get("/followers/count/:userId", getFollowersCount);

router.get("/following/count/:userId", getFollowingCount);

router.get("/followers/:userId", getFollowers);

router.get("/following/:userId", getFollowing);

module.exports = router;