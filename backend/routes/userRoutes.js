// backend/routes/userRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs"); // Use bcrypt for hashing passwords
const User = require("../models/User");
const nodemailer = require("nodemailer");
const router = express.Router();
const fs = require('fs');
const path = require('path');
require("dotenv").config();

const generateEmailTemplate = require('./emailTemplate');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false  
    }
});



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
        const personalizedHtml = generateEmailTemplate(username);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Registration Confirmation',
            html: personalizedHtml,
            attachments: [
                {
                    filename: 'logo512.png',
                    path: path.join(__dirname, 'logo512.png'),
                    cid: 'logoImage'  // Content-ID for referencing in HTML
                },
                {
                    filename: 'events_app.jpg',
                    path: path.join(__dirname, 'events_app.jpg'),
                    cid: 'heroImage'  // Content-ID for referencing in HTML
                }
            ]
        };

       
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error sending email:", error);
            } else {
                console.log("Email sent:", info.response);
            }
        });
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

// Route for updating a user's profile
router.put("/update-profile", async (req, res) => {
    const { email, username, newEmail } = req.body;

    try {
        // Find the user by their email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update the user's information
        if (username) user.username = username;
        if (newEmail) user.email = newEmail;

        await user.save();
        res.status(200).json({ message: "User profile updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;


