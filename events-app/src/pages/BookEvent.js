import React, { useState, useEffect } from "react";
import "../layouts/bookEventStyles.css";
import axios from "axios";

function BookEvent() {
    const [bookingData, setBookingData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
    });

    const [eventDetails, setEventDetails] = useState(null); // Store event details
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const eventId = "6782ddad64f87618b2de85f5"; // Replace with actual event ID, or pass dynamically

    useEffect(() => {
        // Fetch event details when the component mounts
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/events/${ eventId }`);
                setEventDetails(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching event details:", err.response?.data , err.message);
                setError("Failed to load event details. Please try again.");
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [eventId]);

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
                    eventId,
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
            console.error("Error submitting booking:", err.response?.data , err.message);
            alert(
                err.response?.data?.error || "An unexpected error occurred. Please try again."
            );
        }
    };

    if (loading) return <p>Loading event details...</p>;
    if (error) return <p>{error}</p>;
    return (
        <div className="booking-body">
            <div className="form-container">
                <h1 className="booking-h1">Personal Information</h1>
                <form onSubmit={handleSubmit} className="booking-form">
                    <div className="booking-form-group">
                        <label htmlFor="firstName" className="form-label">First Name</label>
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
                        <label htmlFor="lastName" className="form-label">Last Name</label>
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
                        <label htmlFor="email" className="form-label">Your Email</label>
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
                        <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
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
                    <button type="submit" className="booking-button">Continue</button>
                </form>
            </div>
            <div className="summary-container">
                <h2 className="summary-title">Ticket Summary</h2>
                <div className="summary-details">
                    <p>{eventDetails.title}</p>
                    <p>Price: ${eventDetails.price}</p>
                    <p className="summary-total">Total: ${eventDetails.price}</p>
                </div>

                <h2 className="summary-title">Location</h2>
                <p>{eventDetails.location}</p>
                <h2 className="summary-title">Hours</h2>
                <p>{eventDetails.time}</p>
                <button className="calendar-button">Add to Calendar</button>
            </div>
        </div>
    );
}

export default BookEvent;