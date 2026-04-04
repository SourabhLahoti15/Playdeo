const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            enum: [
                "like",
                "dislike",
                "comment",
                "follow",
                "message"
            ],
            required: true
        },

        entityType: {
            type: String,
            enum: ["post", "video", "short", "message"]
        },

        entityId: {
            type: mongoose.Schema.Types.ObjectId
        },

        isRead: {
            type: Boolean,
            default: false
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);