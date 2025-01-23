const express = require("express");
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const router = express.Router();
const isAuthenticated = require("../middleware/auth"); // Authentication middleware
const fs = require('fs');
const multer = require("multer");
const path = require('path');
const User = require("../models/User");

const DEFAULT_IMAGE = "/public/user-images/eventDefault.png";

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../public/user-images"),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Multer file filter
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
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Helper function to delete a file if it exists
const deleteFileIfExists = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

// Create a new event
router.post("/create", isAuthenticated, upload.single("eventImage"), async (req, res) => {
    const { title, description, date, time, location, maxSpots, price } = req.body;

    try {
        const organizerEmail = req.session.email;

        let eventImage = DEFAULT_IMAGE; 
        if (req.file) {
            eventImage = `/public/user-images/${req.file.filename}`; 
        }

        const event = new Event({
            organizerEmail,
            title,
            description,
            date,
            time,
            location,
            maxSpots,
            availableSpots: maxSpots, 
            price,
            eventImage,
        });

        await event.save();
        const fullImageUrl = `${req.protocol}://${req.get("host")}${event.eventImage}`;
        res.status(201).json({ message: "Event created successfully", event, eventImage: fullImageUrl });
    } catch (error) {
        console.error(error);
        if (req.file) {
            deleteFileIfExists(req.file.path);
        }

        res.status(500).json({ error: error.message });
    }
});


// Get all events (public route)
router.get("/all", async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 }); // Sort by createdAt (descending)
        res.status(200).json(events);
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
        }).sort({ createdAt: -1 }); // Sort by createdAt (descending)

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get all events created by the authenticated user
router.get("/my-events", isAuthenticated, async (req, res) => {
    try {
        const organizerEmail = req.session.email; // Use authenticated user's email
        const events = await Event.find({ organizerEmail }).sort({ createdAt: -1 }); // Sort by createdAt (descending)
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Dynamic route for individual event details (must come after `/my-events`)
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id); // Match `_id` only here
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.status(200).json(event);
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
        const allowedUpdates = ["title", "description", "date", "time", "location", "maxSpots", "availableSpots", "price", ];
        Object.keys(updates).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                event[key] = updates[key];
            }
        });

        if (updates.maxSpots !== undefined) {
            const maxSpots = updates.maxSpots;

            // Ensure `availableSpots` is adjusted based on new `maxSpots` value
            const bookedUsersCount = event.maxSpots - event.availableSpots;
            if (maxSpots < bookedUsersCount) {
                return res.status(400).json({
                    error: "Max spots cannot be less than the number of currently booked users",
                });
            }

            // Update `availableSpots`
            event.availableSpots = maxSpots - bookedUsersCount;
        }
        
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
        await Booking.deleteMany({ eventId: id });
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/update-image/:id", isAuthenticated, upload.single("eventImage"), async (req, res) => {
        const { id } = req.params;

        try {
            const organizerEmail = req.session.email;

            // Find the event and verify ownership
            const event = await Event.findOne({ _id: id, organizerEmail });
            if (!event) {
                // Delete uploaded file if the event is not found
                if (req.file) {
                    deleteFileIfExists(req.file.path);
                }
                return res.status(404).json({ error: "Event not found or not authorized" });
            }

            // Delete the previous image if it's not the default
            if (event.eventImage && event.eventImage !== DEFAULT_IMAGE) {
                const oldImagePath = path.join(__dirname, "../", event.eventImage);
                deleteFileIfExists(oldImagePath);
            }

            // Save the new image path
            event.eventImage = `/public/user-images/${req.file.filename}`;
            await event.save();

            const fullImageUrl = `${req.protocol}://${req.get("host")}${event.eventImage}`;
            res.status(200).json({
                message: "Event image updated successfully",
                eventImage: fullImageUrl,
            });
        } catch (error) {
            console.error(error);

            // Clean up the uploaded file if an error occurs
            if (req.file) {
                deleteFileIfExists(req.file.path);
            }

            res.status(500).json({ error: "Error updating event image" });
        }
    }
);

// Delete event image and reset to default
router.put("/reset-image/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    try {
        const organizerEmail = req.session.email;

        // Find the event and verify ownership
        const event = await Event.findOne({ _id: id, organizerEmail });
        if (!event) {
            return res.status(404).json({ error: "Event not found or not authorized" });
        }

        // Delete the current image if it's not the default
        if (event.eventImage && event.eventImage !== DEFAULT_IMAGE) {
            const oldImagePath = path.join(__dirname, "../", event.eventImage);
            deleteFileIfExists(oldImagePath);
        }

        // Reset to the default image
        event.eventImage = DEFAULT_IMAGE;
        await event.save();

        const fullDefaultImageUrl = `${req.protocol}://${req.get("host")}${DEFAULT_IMAGE}`;
        res.status(200).json({
            message: "Event image reset to default",
            eventImage: fullDefaultImageUrl,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error resetting event image" });
    }
});

module.exports = router;
