import React, { useState } from "react";
import axios from "axios";
import "../layouts/createEventStyles.css";

function CreateEvent() {
    const [eventData, setEventData] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        maxSpots: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const response = await axios.post("/api/events/create", eventData, {
                withCredentials: true, // Include cookies for authentication
            });
            setSuccessMessage("Event created successfully!");
            console.log("Event created:", response.data);
            setEventData({
                title: "",
                description: "",
                date: "",
                time: "",
                location: "",
                maxSpots: "",
            });
        } catch (error) {
            setErrorMessage(
                error.response?.data?.error || "Failed to create event. Please try again."
            );
            console.error("Error creating event:", error);
        }
    };

    return (
        <div className="event-body">
            
            <h1 className="event-h1">Create an Event</h1>

            <div className="event-info-container">
                <form onSubmit={handleSubmit} className="event-form">
                    <div className="event-form-group">
                        <label htmlFor="title">Event Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Enter event title"
                            value={eventData.title}
                            onChange={handleChange}
                            className="event-profile-input"
                            required
                        />
                    </div>

                    <div className="event-form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Enter event description"
                            value={eventData.description}
                            onChange={handleChange}
                            className="event-profile-input"
                            rows="4"
                            required
                        />
                    </div>


                    <div className="date-time-container">
                        <div>
                            <label htmlFor="date">Event Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={eventData.date}
                                onChange={handleChange}
                                className="event-profile-input"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="time">Event Time</label>
                            <input
                                type="time"
                                id="time"
                                name="time"
                                value={eventData.time}
                                onChange={handleChange}
                                className="event-profile-input"
                                required
                            />
                        </div>
                    </div>

                    
                    <div className="location-spots-container">
                        <div>
                            <label htmlFor="location">Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                placeholder="Enter event location"
                                value={eventData.location}
                                onChange={handleChange}
                                className="event-profile-input"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="maxSpots">Maximum Spots</label>
                            <input
                                type="number"
                                id="maxSpots"
                                name="maxSpots"
                                placeholder="Enter maximum spots"
                                value={eventData.maxSpots}
                                onChange={handleChange}
                                className="event-profile-input"
                                required
                            />
                        </div>
                    </div>

                    {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

                    <button type="submit" className="event-button">
                        Create Event
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateEvent;
