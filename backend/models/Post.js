const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    images: {
      type: [String],
      required: true,
      validate: [arr => arr.length <= 10, "Maximum 10 images allowed"]
    },

    caption: {
      type: String,
      default: ""
    },

    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],

    dislikes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],

    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }],

    // bookmarks: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User"
    // }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);