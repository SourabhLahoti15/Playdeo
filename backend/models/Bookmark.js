const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  entityType: {
    type: String,
    enum: ["post", "video", "short"],
    required: true
  },

  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Bookmark", bookmarkSchema);