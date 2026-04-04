const Post = require("../models/Post");
const Follow = require("../models/Follow");
const Notification = require("../models/Notification");

exports.createPost = async (req, res) => {
  try {
    const caption = req.body.caption;

    const images = req.files ? req.files.map(file => file.path) : [];

    const post = new Post({
      user: req.user.userId,
      images,
      caption
    });

    await post.save();

    res.status(201).json(post);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const posts = await Post.find()
      .populate("user", "-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const skip = (page - 1) * limit;

    const following = await Follow.find({ follower: userId }).select("following");
    const followingIds = following.map(f => f.following);

    const posts = await Post.find({ user: { $in: followingIds } })
      .populate("user", "-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(posts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const liked = post.likes.includes(userId);
    if (liked) {
      post.likes = post.likes.filter(
        id => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);
      post.dislikes = post.dislikes.filter(
        id => id.toString() !== userId
      );
    }
    await post.save();

    if (!liked) {
      const notification = new Notification({
        recipient: post.user,
        sender: userId,
        type: "like",
        entityType: "post",
        entityId: postId
      });
      await notification.save();
    }
    res.json({
      likes: post.likes,
      dislikes: post.dislikes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.dislikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const disliked = post.dislikes.includes(userId);
    if (disliked) {
      post.dislikes = post.dislikes.filter(
        id => id.toString() !== userId
      );
    } else {
      post.dislikes.push(userId);
      post.likes = post.likes.filter(
        id => id.toString() !== userId
      );
    }
    await post.save();
    if (!disliked) {
      const notification = new Notification({
        recipient: post.user,
        sender: userId,
        type: "dislike",
        entityType: "post",
        entityId: postId
      });
      await notification.save();
    }
    res.json({
      likes: post.likes,
      dislikes: post.dislikes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await Post.deleteOne({ _id: postId });
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;
    const { caption } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    post.caption = caption;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate("user", "-password");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ user: userId })
      .populate("user", "-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
