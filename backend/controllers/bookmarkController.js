const Bookmark = require("../models/Bookmark");

exports.checkBookmark = async (req, res) => {
    const model = {
        post: "Post",
        video: "Video",
        short: "Short"
    }
    try {
        const userId = req.user.userId;
        const { entityType, entityId } = req.params;
        const entityModel = model[entityType];
        const existing = await Bookmark.findOne({
            user: userId,
            entityModel,
            entityId
        });
        res.json({ bookmarked: !!existing });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.bookmarkPost = async (req, res) => {
    const model = {
        post: "Post",
        video: "Video",
        short: "Short"
    }
    try {
        const userId = req.user.userId;
        const { entityType, entityId } = req.params;
        const entityModel = model[entityType];
        const existing = await Bookmark.findOne({
            user: userId,
            entityModel,
            entityId
        });
        if (existing) {
            await existing.deleteOne();
            return res.json({ bookmarked: false });
        }
        await Bookmark.create({
            user: userId,
            entityModel,
            entityId
        });
        res.json({ bookmarked: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBookmarkedPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    try {
        const userId = req.user.userId;
        const bookmarks = await Bookmark.find({
            user: userId,
            entityModel: "Post"
        }).populate({
            path: "entityId",
            populate: {
                path: "user",
                select: "-password"
            }
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.json(bookmarks.map(b => b.entityId));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBookmarkedVideos = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    try {
        const userId = req.user.userId;
        const bookmarks = await Bookmark.find({
            user: userId,
            entityModel: "Video"
        }).populate({
            path: "entityId",
            populate: {
                path: "user",
                select: "-password"
            }
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.json(bookmarks.map(b => b.entityId));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBookmarkedShorts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    try {
        const userId = req.user.userId;
        const bookmarks = await Bookmark.find({
            user: userId,
            entityModel: "Short"
        }).populate({
            path: "entityId",
            populate: {
                path: "user",
                select: "-password"
            }
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.json(bookmarks.map(b => b.entityId));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};