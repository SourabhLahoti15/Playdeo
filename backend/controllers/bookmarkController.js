const Bookmark = require("../models/Bookmark");

exports.bookmarkPost = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { entityType, entityId } = req.params;
        const existing = await Bookmark.findOne({
            user: userId,
            entityType,
            entityId
        });
        if (existing) {
            await existing.deleteOne();
            return res.json({ bookmarked: false });
        }
        await Bookmark.create({
            user: userId,
            entityType,
            entityId
        });
        res.json({ bookmarked: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBookmarks = async (req, res) => {
    try {
        const userId = req.user.userId;
        const bookmarks = await Bookmark.find({
            user: userId
        })
            .populate("entityId")
            .populate("user", "-password")
            .sort({ createdAt: -1 });
        res.json(bookmarks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.checkBookmark = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { entityType, entityId } = req.params;
        const existing = await Bookmark.findOne({
            user: userId,
            entityType,
            entityId
        });
        res.json({ bookmarked: !!existing });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}