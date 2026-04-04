const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        thumbnail: {
            type: String
        },

        videoUrl: {
            type: String,
            required: true
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String
        },

        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],

        dislikes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],

        views: {
            type: Number,
            default: 0
        },
        
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }],
        
        // bookmarks: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "User"
        // }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);