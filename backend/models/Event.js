const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    organizerEmail: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    maxSpots: { type: Number, required: true },
    availableSpots: { type: Number, required: true },
});

module.exports = mongoose.model("Event", EventSchema);

