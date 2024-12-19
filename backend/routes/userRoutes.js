// backend/routes/userRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Event = require("../models/Event");
const nodemailer = require("nodemailer");
const router = express.Router();
const fs = require('fs');
const multer = require("multer");
const path = require('path');
require("dotenv").config();

const generateEmailTemplate = require('./emailTemplate');
const DEFAULT_IMAGE = '/user-images/default.png'; // Define the default image path



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

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/user-images'),  // Correct path
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
        cb(new Error("Only JPEG and PNG images are allowed"));
    } else {
        cb(null, true);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
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
        req.session.email = newUser.email;
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

        // Create a session and store user info
        
        req.session.email = user.email;
        console.log('Session Email:', req.session.email);
        console.log("Session created:", req.session);  // Check if session data is being saved

        res.status(200).json({ message: "User signed in successfully" });

        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Route to check session data
router.get("/", async (req, res) => {
    if (req.session.email) {
        res.status(200).json({ message: "User is logged in", user });
    } else {
        res.status(400).json({ error: "No active session found" });
    }
});




router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Failed to log out');
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        console.error('Logout');
    });
});


// Route to check profile data
router.get("/profile-data", async (req, res) => {
    try {
        if (!req.session.email) {
            return res.status(401).json({ error: "Unauthorized: No active session" });
        }
        const user = await User.findOne({ email: req.session.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const fullImageUrl = `${req.protocol}://${req.get('host')}${user.profileImage}`;
        const events = await Event.find({ organizerEmail: req.session.email }).sort({ createdAt: -1 });
        res.status(200).json({
            username: user.username,
            email: user.email,
            profileImage: fullImageUrl,
            events,
        });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving user data" });
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



router.put("/update-image", upload.single("profileImage"), async (req, res) => {
    try {
        const { email } = req.body;  // Get email from the request body
        const user = await User.findOne({ email });  // Find the user by email

        if (!user) {
            // Delete the uploaded file if the user is not found
            if (req.file) {
                fs.unlinkSync(req.file.path); // Remove the newly uploaded file
            }
            return res.status(404).json({ error: "User not found" });
        }
       
        // Check if the user already has an existing image and delete it (only if it's not the default)
        if (user.profileImage === DEFAULT_IMAGE) {
            
            console.log("Default image is set, skipping deletion");
        } else {
            const oldImagePath = path.join(__dirname, '..', 'public', user.profileImage);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath); // Delete only custom images
            }
        }


        // Save the new profile image path (relative to public)
        user.profileImage = `/user-images/${req.file.filename}`;  // Correct path

        await user.save();

        // Return the full URL of the new image
        const fullImageUrl = `${req.protocol}://${req.get('host')}${user.profileImage}`;
        res.status(200).json({ message: "Profile image updated successfully", profileImage: fullImageUrl });
    } catch (error) {
        console.error(error);

        // Clean up in case of errors
        if (req.file) {
            fs.unlinkSync(req.file.path); // Remove the newly uploaded file
        }

        res.status(500).json({ error: "Error updating profile image" });
    }
});


router.put("/delete-image", async (req, res) => {
    try {
        const { email } = req.body;  // Get email from the request body
        const user = await User.findOne({ email });  // Find the user by email

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the user has a custom image and delete it
        if (user.profileImage && user.profileImage !== DEFAULT_IMAGE) {
            const imagePath = path.join(__dirname, '..', 'public', user.profileImage);
            // Verify that the file path is not the default image
            if (fs.existsSync(imagePath) && !imagePath.endsWith(DEFAULT_IMAGE)) {
                fs.unlinkSync(imagePath); // Delete the custom image file
            }
        }

        // Set the profile image to the default image
        user.profileImage = DEFAULT_IMAGE;
        await user.save();

        // Return the default image URL
        const fullDefaultImageUrl = `${req.protocol}://${req.get('host')}${DEFAULT_IMAGE}`;
        res.status(200).json({ message: "Profile image reset to default", profileImage: fullDefaultImageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting profile image" });
    }
});


module.exports = router;
