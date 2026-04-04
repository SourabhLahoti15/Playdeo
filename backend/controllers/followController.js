const Follow = require("../models/Follow");
const Notification = require("../models/Notification");

exports.checkFollowStatus = async (req, res) => {
    try {
        const followerId = req.user.userId;
        const followingId = req.params.userId;

        const exists = await Follow.exists({
            follower: followerId,
            following: followingId
        });

        res.json({ isFollowing: !!exists });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.followUser = async (req, res) => {
    try {
        const followerId = req.user.userId;
        const followingId = req.params.userId;

        if (followerId === followingId) {
            return res.status(400).json({ message: "You can't follow yourself" });
        }

        const existing = await Follow.findOne({
            follower: followerId,
            following: followingId
        });
        if (existing) {
            return res.status(400).json({ message: "Already following" });
        }

        const follow = new Follow({
            follower: followerId,
            following: followingId
        });
        await follow.save();
        const notification = new Notification({
            recipient: followingId,
            sender: followerId,
            type: "follow"
        });
        await notification.save();
        const followersCount = await Follow.countDocuments({
            following: followingId
        });
        res.status(201).json({
            isFollowing: true,
            followersCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const followerId = req.user.userId;
        const followingId = req.params.userId;
        await Follow.deleteOne({
            follower: followerId,
            following: followingId
        });
        // await Notification.deleteOne({
        //     sender: followerId,
        //     recipient: followingId,
        //     type: "follow"
        // });
        const followersCount = await Follow.countDocuments({
            following: followingId
        });
        res.status(201).json({
            isFollowing: false,
            followersCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFollowers = async (req, res) => {
    try {
        const userId = req.params.userId;
        const followers = await Follow.find({ following: userId })
            .populate("follower", "-password");
        res.json(followers.map(f => f.follower));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFollowing = async (req, res) => {
    try {
        const userId = req.params.userId;
        const following = await Follow.find({ follower: userId })
            .populate("following", "-password");
        res.json(following.map(f => f.following));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFollowersCount = async (req, res) => {
    try {
        const userId = req.params.userId;
        const count = await Follow.countDocuments({
            following: userId
        });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFollowingCount = async (req, res) => {
    try {
        const userId = req.params.userId;
        const count = await Follow.countDocuments({
            follower: userId
        });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};