const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                field: "email",
                message: "Email already exists"
            });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({
                field: "username",
                message: "Username already taken"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
            username,
            email,
            password: hashedPassword
        });
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        await user.save();
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                field: "username",
                message: "User not found"
            });
        }
        const bcrypt = require("bcrypt");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                field: "password",
                message: "Invalid password"
            });
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.json({
            token,
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Follow = require("../models/Follow");
const Post = require("../models/Post");

exports.getUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserPosts = async (req, res) => {
    try {
        const userId = req.params.userId;
        const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const query = req.query.q;
        const users = await User.find({
            username: { $regex: query, $options: "i" }
        }).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};