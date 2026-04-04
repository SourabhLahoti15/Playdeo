const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getUser, getUserPosts, searchUsers } = require("../controllers/userController");

router.get("/:userId", getUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/search", searchUsers);
router.get("/:userId/posts", getUserPosts);

module.exports = router;