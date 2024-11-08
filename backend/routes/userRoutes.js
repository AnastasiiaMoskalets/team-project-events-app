// backend/routes/userRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs"); // Use bcrypt for hashing passwords
const User = require("../models/User");
const router = express.Router();


// Route for signing up a user
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);  // Hashing the password

        const newUser = new User({
            username,
            email,
            passwordHash: hashedPassword,  // Store the hashed password
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route for signing in a user
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email" });
        }

        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }

        res.status(200).json({ message: "User signed in successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;


module.exports = router;