const express = require("express");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const User = require("../models/User");
const isAuthenticated = require("../middleware/auth");
const router = express.Router();

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


module.exports = router;
