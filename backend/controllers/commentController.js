const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Video = require("../models/Video");
const Short = require("../models/Short");
const Notification = require("../models/Notification");

exports.createComment = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { entityType, entityId } = req.params;
        const { text } = req.body;

        const comment = new Comment({
            entityType,
            entityId,
            user: userId,
            text
        });
        await comment.save();
        await comment.populate("user", "-password");
        
        const models = {
            post: Post,
            video: Video,
            short: Short
        };
        const Model = models[entityType];
        const entity = await Model.findById(entityId);
        await Model.findByIdAndUpdate(entityId, { $push: { comments: comment._id } });
        if (entity && entity.user.toString() !== userId) {
            const notification = new Notification({
                recipient: entity.user,
                sender: userId,
                type: "comment",
                entityType,
                entityId
            });
            await notification.save();
        }
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const { entityType, entityId } = req.params;
        const { page = 1 } = req.query;
        const limit = 10;
        const skip = (page - 1) * limit;
        const comments = await Comment.find({ entityType, entityId })
            .populate("user", "-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};