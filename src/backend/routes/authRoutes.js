// backend/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const upload = require('../middleware/upload');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

// ✅ Register User with Username, Email & Photo
router.post('/register', upload.single('photo'), async (req, res) => {
    try {
        const { username, firstName, middleName, lastName, mobile, email, password } = req.body;

        if (!username || !firstName || !lastName || !mobile || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email or username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const fullName = `${firstName} ${middleName ? middleName + " " : ""}${lastName}`.trim();

        const newUser = new User({
            username,
            firstName,
            middleName,
            lastName,
            fullName,
            mobile,
            email,
            password: hashedPassword,
            photo: req.file ? req.file.path : null
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Serve Profile Photo
router.get('/photo/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user || !user.photo) {
            return res.status(404).json({ message: "Photo not found" });
        }

        res.set('Content-Type', user.photoType);
        res.send(user.photo);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving photo" });
    }
});

// ✅ User Login with Email or Username
router.post('/login', async (req, res) => {
    try {
        const { identifier, password, captcha, captchaText } = req.body;

        // Validate captcha
        if (captcha !== captchaText) return res.status(400).json({ message: 'Invalid captcha' });

        // Check user by username or email
        let user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
