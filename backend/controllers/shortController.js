const Short = require("../models/Short");
const Follow = require("../models/Follow");
const Notification = require("../models/Notification");

exports.createShort = async (req, res) => {
    try {
        const userId = req.user.userId;
        const videoPath = req.files.short[0].path;
        const thumbnailPath = req.files.thumbnail[0].path;
        const { caption } = req.body;
        const short = new Short({
            user: userId,
            thumbnail: thumbnailPath,
            videoUrl: videoPath,
            caption
        });
        await short.save();
        res.status(201).json(short);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllShorts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const shorts = await Short.find()
            .populate("user", "-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.json(shorts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFollowingShorts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const userId = req.user.userId;
        const following = await Follow.find({ follower: userId })
            .select("following");
        const followingIds = following.map(f => f.following);
        const shorts = await Short.find({
            user: { $in: followingIds }
        })
            .populate("user", "-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.json(shorts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.likeShort = async (req, res) => {
    try {
        const shortId = req.params.id;
        const userId = req.user.userId;
        const short = await Short.findById(shortId);
        if (!short) {
            return res.status(404).json({ message: "Short not found" });
        }
        const liked = short.likes.includes(userId);
        if (liked) {
            short.likes = short.likes.filter(
                id => id.toString() !== userId
            );
        } else {
            short.likes.push(userId);
            short.dislikes = short.dislikes.filter(
                id => id.toString() !== userId
            );
        }
        await short.save();
        if (!liked) {
            const notification = new Notification({
                recipient: short.user,
                sender: userId,
                type: "like",
                entityType: "short",
                entityId: shortId
            });
            await notification.save();
        }
        res.json({
            likes: short.likes,
            dislikes: short.dislikes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.dislikeShort = async (req, res) => {
    try {
        const shortId = req.params.id;
        const userId = req.user.userId;
        const short = await Short.findById(shortId);
        if (!short) {
            return res.status(404).json({ message: "Short not found" });
        }
        const disliked = short.dislikes.includes(userId);
        if (disliked) {
            short.dislikes = short.dislikes.filter(
                id => id.toString() !== userId
            );
        } else {
            short.dislikes.push(userId);
            short.likes = short.likes.filter(
                id => id.toString() !== userId
            );
        }
        await short.save();
        if (!disliked) {
            const notification = new Notification({
                recipient: short.user,
                sender: userId,
                type: "dislike",
                entityType: "short",
                entityId: shortId
            });
            await notification.save();
        }
        res.json({
            likes: short.likes,
            dislikes: short.dislikes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addShortView = async (req, res) => {
    try {
        const shortId = req.params.id;
        const short = await Short.findById(shortId);
        if (!short) {
            return res.status(404).json({ message: "Short not found" });
        }
        short.views += 1;
        await short.save();
        res.json({ views: short.views });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserShorts = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const Shorts = await Short.find({ user: userId })
      .populate("user", "-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json(Shorts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};