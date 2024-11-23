const express = require("express");
const Event = require("../models/Event");
const router = express.Router();
const isAuthenticated = require("../middleware/auth"); // Authentication middleware

// Create a new event
router.post("/create", isAuthenticated, async (req, res) => {
    const { title, description, date, time, location, maxSpots } = req.body;

    try {
        // Use the authenticated user's email
        const organizerEmail = req.session.email;

        const event = new Event({
            organizerEmail,
            title,
            description,
            date,
            time,
            location,
            maxSpots,
            availableSpots: maxSpots, // Initially all spots are available
        });

        await event.save();
        res.status(201).json({ message: "Event created successfully", event });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all events (public route)
router.get("/all", async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get details of a specific event (public route)
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search events by title (or category-like filtering, public route)
router.get("/search", async (req, res) => {
    const { query } = req.query; // e.g., /search?query=music

    try {
        const events = await Event.find({
            title: { $regex: query, $options: "i" }, // Case-insensitive search
        });

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all events created by the authenticated user
router.get("/my-events", isAuthenticated, async (req, res) => {
    try {
        const organizerEmail = req.session.email;

        const events = await Event.find({ organizerEmail });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an event (all fields except organizerEmail)
router.put("/update/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const organizerEmail = req.session.email;

        // Find the event and verify ownership
        const event = await Event.findOne({ _id: id, organizerEmail });
        if (!event) {
            return res.status(404).json({ error: "Event not found or not authorized" });
        }

        // Exclude organizerEmail from being updated
        const allowedUpdates = ["title", "description", "date", "time", "location", "maxSpots", "availableSpots"];
        Object.keys(updates).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                event[key] = updates[key];
            }
        });

        await event.save();

        res.status(200).json({ message: "Event updated successfully", event });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an event
router.delete("/delete/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    try {
        const organizerEmail = req.session.email;

        // Find the event and verify ownership
        const event = await Event.findOneAndDelete({ _id: id, organizerEmail });
        if (!event) {
            return res.status(404).json({ error: "Event not found or not authorized" });
        }

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
