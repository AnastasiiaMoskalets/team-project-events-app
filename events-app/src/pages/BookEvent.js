import React, { useState } from "react";
import "../layouts/bookEventStyles.css";

function BookEvent() {
    const [bookingData, setBookingData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        businessDetails: "Individual",
    });

    const [price, setPrice] = useState(100); // Example price for the event
    const fees = 7.5;
    const total = price + fees;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Event booked successfully!");
        console.log("Booking data:", bookingData);
    };

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
                    <p>2 General Admission</p>
                    <p>Price: $<span>{price}</span></p>
                    <p>Fees: $<span>{fees}</span></p>
                    <p className="summary-total">Total: $<span>{total}</span></p>
                </div>

                <h2 className="summary-title">Location</h2>
                <p>Balai Kartini, Nusa Indah Theatre, Jl. Gatot Subroto No. 37, Kuningan, Jakarta Selatan</p>
                <h2 className="summary-title">Hours</h2>
                <p>Weekday Hours: 7 PM - 10 PM</p>
                <p>Sunday Hours: 10 AM - 3 PM</p>
                <button className="calendar-button">Add to Calendar</button>
            </div>
        </div>
    );
}

export default BookEvent;