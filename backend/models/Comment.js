const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    entityType: {
        type: String,
        enum: ["post", "video", "short", "text"],
        required: true
    },

    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);