const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    text: {
        type: String,
        required: true
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