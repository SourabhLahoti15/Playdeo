const Video = require("../models/Video");
const Follow = require("../models/Follow");
const Notification = require("../models/Notification");

exports.createVideo = async (req, res) => {
    try {
        const userId = req.user.userId;
        const videoPath = req.files.video[0].path;
        const thumbnailPath = req.files.thumbnail[0].path;
        const { title, description } = req.body;
        const video = new Video({
            user: userId,
            thumbnail: thumbnailPath,
            videoUrl: videoPath,
            title,
            description,
        });
        await video.save();
        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllVideos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const videos = await Video.find()
            .populate("user", "-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFollowingVideos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const userId = req.user.userId;
        const following = await Follow.find({ follower: userId })
            .select("following");
        const followingIds = following.map(f => f.following);
        const videos = await Video.find({
            user: { $in: followingIds }
        })
            .populate("user", "-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.likeVideo = async (req, res) => {
    try {
        const videoId = req.params.id;
        const userId = req.user.userId;
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        const liked = video.likes.includes(userId);
        if (liked) {
            video.likes = video.likes.filter(
                id => id.toString() !== userId
            );
        } else {
            video.likes.push(userId);
            video.dislikes = video.dislikes.filter(
                id => id.toString() !== userId
            );
        }
        await video.save();
        if (!liked) {
            const notification = new Notification({
                recipient: video.user,
                sender: userId,
                type: "like",
                entityType: "video",
                entityId: videoId
            });
            await notification.save();
        }
        res.json({
            likes: video.likes,
            dislikes: video.dislikes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.dislikeVideo = async (req, res) => {
    try {
        const videoId = req.params.id;
        const userId = req.user.userId;
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        const disliked = video.dislikes.includes(userId);
        if (disliked) {
            video.dislikes = video.dislikes.filter(
                id => id.toString() !== userId
            );
        } else {
            video.dislikes.push(userId);
            video.likes = video.likes.filter(
                id => id.toString() !== userId
            );
        }
        await video.save();
        if (!disliked) {
            const notification = new Notification({
                recipient: video.user,
                sender: userId,
                type: "dislike",
                entityType: "video",
                entityId: videoId
            })
            await notification.save();
        }
        res.json({
            likes: video.likes,
            dislikes: video.dislikes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addVideoView = async (req, res) => {
    try {
        const videoId = req.params.id;
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        video.views += 1;
        await video.save();
        res.json({ views: video.views });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserVideos = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const videos = await Video.find({ user: userId })
      .populate("user", "-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
