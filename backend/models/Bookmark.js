const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    entityModel: {
      type: String,
      required: true,
      enum: ["Post", "Video", "Short"]
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "entityModel",
      required: true
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Bookmark", bookmarkSchema);