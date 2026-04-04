const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createShort,
  getAllShorts,
  getFollowingShorts,
  likeShort,
  dislikeShort,
  addShortView,
  getUserShorts
} = require("../controllers/shortController");
const upload = require("../middleware/upload");

router.post("/", authMiddleware, upload.fields([{ name: "short", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), createShort);
router.get("/", getAllShorts);
router.get("/following", authMiddleware, getFollowingShorts);
router.post("/:id/like", authMiddleware, likeShort);
router.post("/:id/dislike", authMiddleware, dislikeShort);
router.post("/:id/view", addShortView);
router.get("/user/:userId", getUserShorts);

module.exports = router;