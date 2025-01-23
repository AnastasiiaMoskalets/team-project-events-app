const express = require("express");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const User = require("../models/User");
const isAuthenticated = require("../middleware/auth");
const router = express.Router();
const nodemailer = require("nodemailer");
const fs = require('fs');
const multer = require("multer");
const path = require('path');
require("dotenv").config();

const generateBookingEmailTemplate = require('./emailTemplateBooking');


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
// Create a booking
router.post("/book", isAuthenticated, async (req, res) => {
    const { eventId, firstName, lastName, phoneNumber, contactEmail } = req.body;

    try {
        const user = await User.findOne({ email: req.session.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const userId = user._id;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        // Check if the event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Check if spots are available
        if (event.availableSpots <= 0) {
            return res.status(400).json({ error: "No spots available for this event" });
        }

        // Create a new booking
        const booking = new Booking({
            userId,
            eventId,
            firstName,
            lastName,
            phoneNumber,
            contactEmail,
        });

        // Save the booking and update available spots
        await booking.save();
        event.availableSpots -= 1;
        await event.save();

        let formattedDateTime;
        try {
            const eventDate = event.date.toISOString().split('T')[0]; // Extract the date part in YYYY-MM-DD format
            formattedDateTime = new Date(`${eventDate}T${event.time}:00`).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
            });
        } catch (error) {
            console.error("Error formatting date and time:", error);
            formattedDateTime = "Invalid date/time";
        }



        const personalizedHtml = generateBookingEmailTemplate(booking.firstName, event.title, formattedDateTime, event.location);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: contactEmail,
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
        res.status(201).json({ message: "Booking successful", booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating booking" });
    }
});

// Cancel a booking
router.delete("/cancel/:bookingId", isAuthenticated, async (req, res) => {
    const { bookingId } = req.params;

    try {
        const user = await User.findOne({ email: req.session.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const userId = user._id;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        // Find and delete the booking
        const booking = await Booking.findOneAndDelete({ _id: bookingId, userId });
        if (!booking) {
            return res.status(404).json({ error: "Booking not found or unauthorized" });
        }

        // Update available spots for the event
        await Event.findByIdAndUpdate(booking.eventId, { $inc: { availableSpots: 1 } });

        res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error cancelling booking" });
    }
});

// Get all bookings for a user
router.get("/my-bookings", isAuthenticated, async (req, res) => {
    try {
        // Ensure session email exists
        console.log("Session email:", req.session.email);
        if (!req.session.email) {
            return res.status(401).json({ error: "Unauthorized: No active session" });
        }

        // Find the user by email
        const user = await User.findOne({ email: req.session.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Log user ID for debugging
        const userId = user._id;
        console.log("User ID for bookings query:", userId);

        // Find bookings and populate event details
        const bookings = await Booking.find({ userId }).populate("eventId", "title date location");
        console.log("Retrieved bookings:", bookings);

        // Respond with bookings
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error in /my-bookings route:", error);
        res.status(500).json({ error: "Error retrieving bookings" });
    }
});
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        if (!req.session.email) {
            return res.status(401).json({ error: "Unauthorized: No active session" });
        }
        const user = await User.findOne({ email: req.session.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const booking = await Booking.findById(id); // Match `_id` only here
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




module.exports = router;
