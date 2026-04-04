const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { createComment, getComments } = require("../controllers/commentController");

router.post("/:entityType/:entityId", authMiddleware, createComment);
router.get("/:entityType/:entityId", getComments);

module.exports = router;