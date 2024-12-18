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
        price: "",
    });

    const [eventImage, setEventImage] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        setEventImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        const formData = new FormData();
        Object.keys(eventData).forEach((key) => {
            formData.append(key, eventData[key]);
        });
        if (eventImage) {
            formData.append("eventImage", eventImage);
        }

        try {
            const response = await axios.post("http://localhost:5000/api/events/create", formData, {
                withCredentials: true
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
                price: "",
            });
            setEventImage(null);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.error || "Failed to create event. Please try again."
            );
            console.error("Error creating event:", error);
        }
    };

    return (
        <div className="event-body">
            <div className="event-info-container">
                <h1 className="event-h1">Create an Event</h1>
                <form onSubmit={handleSubmit} className="event-form">
                    <div className="event-form-group">
                        <div className="add-image-container">
                            <div className="add-image-text">
                                {eventImage ? eventImage.name : "No image selected"}
                            </div>
                            <button
                                type="button"
                                className="event-button add-image-button"
                                onClick={() => document.getElementById("eventImage").click()}
                            >
                                Add an Image
                            </button>
                            <input
                                type="file"
                                id="eventImage"
                                name="eventImage"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                        </div>
                    </div>

                    <div className="event-form-group title-price-container">
                        <div className="input-container">
                            <label className="form-label" htmlFor="title">Event Title</label>
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
                        <div className="input-container">
                            <label className="form-label" htmlFor="price">Price ($)</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                placeholder="Enter price"
                                value={eventData.price}
                                onChange={handleChange}
                                className="event-profile-input"
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="event-form-group input-container create-event-input-container ">
                        <label className="form-label" htmlFor="description">Description</label>
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
                        <div className="input-container create-event-input-container">
                            <label className="form-label" htmlFor="date">Event Date</label>
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
                        <div className="input-container create-event-input-container">
                            <label className="form-label" htmlFor="time">Event Time</label>
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

                    <div className="location-spots-container ">
                        <div className="input-container create-event-input-container">
                            <label className="form-label" htmlFor="location">Location</label>
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
                        <div className="input-container create-event-input-container">
                            <label className="form-label" htmlFor="maxSpots">Maximum Spots</label>
                            <input
                                type="number"
                                id="maxSpots"
                                name="maxSpots"
                                placeholder="Enter maximum spots"
                                value={eventData.maxSpots}
                                onChange={handleChange}
                                className="event-profile-input"
                                required
                                min="1"  // ����������� �������� ������� ������ �� 1
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
