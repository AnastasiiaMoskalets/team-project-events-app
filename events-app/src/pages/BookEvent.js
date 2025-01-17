import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../layouts/bookEventStyles.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faClock } from "@fortawesome/free-solid-svg-icons";

function BookEvent() {
    const [bookingData, setBookingData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
    });

    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {id} = useParams();

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                console.log(id);
                const response = await axios.get(`http://localhost:5000/api/events/${id}`);
                setEventDetails(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching event details:", err.response?.data, err.message);
                setError("Failed to load event details. Please try again.");
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/api/bookings/book",
                {
                    eventId: id,
                    firstName: bookingData.firstName,
                    lastName: bookingData.lastName,
                    phoneNumber: bookingData.phoneNumber,
                    contactEmail: bookingData.email,
                },
                { withCredentials: true }
            );

            if (response.status === 201) {
                alert("Event booked successfully!");
                console.log("Booking successful:", response.data.booking);
            } else {
                alert("Error booking event. Please try again.");
            }
        } catch (err) {
            console.error("Error submitting booking:", err.response?.data, err.message);
            alert(err.response?.data?.error || "An unexpected error occurred. Please try again.");
        }
    };

    if (loading) return <p>Loading event details...</p>;
    if (error) return <p>{error}</p>;

    const imageUrl = eventDetails?.eventImage
        ? `http://localhost:5000${eventDetails.eventImage}`
        : "http://localhost:5000/user-images/eventDefault.png"; // Fallback to default image

    return (
        <div className="booking-body">
            <div className="forms-container">
                <h1 className="booking-h1">Personal Information</h1>
                <form onSubmit={handleSubmit} className="bookings-form">
                    <div className="booking-form-group">
                        <label htmlFor="firstName" className="forms-label">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={bookingData.firstName}
                            onChange={handleChange}
                            placeholder="Ex. Samantha"
                            className="booking-input"
                            required
                        />
                    </div>
                    <div className="booking-form-group">
                        <label htmlFor="lastName" className="forms-label">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={bookingData.lastName}
                            onChange={handleChange}
                            placeholder="Ex. William"
                            className="booking-input"
                            required
                        />
                    </div>
                    <div className="booking-form-group">
                        <label htmlFor="email" className="forms-label">Your Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={bookingData.email}
                            onChange={handleChange}
                            placeholder="Ex. hello@gmail.com"
                            className="booking-input"
                            required
                        />
                    </div>
                    <div className="booking-form-group">
                        <label htmlFor="phoneNumber" className="forms-label">Phone Number</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={bookingData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Ex. +1 647 5760 7485"
                            className="booking-input"
                            required
                        />
                    </div>
                    <button type="submit" className="booking-button">Book an Event</button>
                </form>
            </div>
            <div className="summary-container">
                <img src={imageUrl} alt="Event" className="booking-event-image" />
                <h2 className="summary-title">
                    <FontAwesomeIcon icon={faLocationDot} /> Event Summary
                </h2>
                <div className="summary-details">
                    <p>{eventDetails.title}</p>
                    <p>Price: ${eventDetails.price}</p>
                </div>
                <h2 className="summary-title">
                    <FontAwesomeIcon icon={faLocationDot} /> Location
                </h2>
                <div className="summary-details">
                    <p>{eventDetails.location}</p>
                </div>
                <h2 className="summary-title">
                    <FontAwesomeIcon icon={faClock} /> Hours
                </h2>
                <div className="summary-details">
                    <p>{eventDetails.time}</p>
                </div>
            </div>
        </div>
    );
}

export default BookEvent;
