import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from "react-router-dom";
import "../layouts/userEventsStyles.css";

function UserEvents() {
    const [userData, setUserData] = useState({
        username: "loading...",
        events: []
    });

    const [isCreatingEvent, setIsCreatingEvent] = useState(false);
    const [isLoading, setIsLoading] = useState(true);  // Loading state
    const [error, setError] = useState(null);  // Error state

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/users/profile-data", {
                    withCredentials: true
                });
                if (response.status === 200) {
                    setUserData({
                        username: response.data.username,
                        events: response.data.events || []  // Ensure you populate events if available
                    });
                    setIsLoading(false); // Done loading
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to load user data");  // Handle error gracefully
                setIsLoading(false);  // Done loading even on error
            }
        };
        fetchUserData();
    }, []);

    const handleCreateEventClick = () => {
        setIsCreatingEvent(true);
        // Later you can add the logic for creating an event, e.g., a form that appears.
    };

    if (isLoading) {
        return <div>Loading...</div>;  // Show loading message while data is being fetched
    }

    if (error) {
        return <div>{error}</div>;  // Show error message if something went wrong
    }

    return (
        <div className='user-events-container'>
            <h1 className='account-header'>{userData.username}'s Dashboard</h1>
            <div className='info-container'>
                <div className='events-header'>
                    <h2>Your Events</h2>
                    <button
                        onClick={handleCreateEventClick}
                        className="create-event-button"
                    >
                        Create an Event
                    </button>
                </div>

                {isCreatingEvent && (
                    <div className="event-creation-form">
                        {/* Placeholder for event creation logic */}
                        <h3>Event Creation Form (Placeholder)</h3>
                        <p>This will be a form to create a new event. Implement later.</p>
                    </div>
                )}

                {/* List of events (if available) */}
                <div className='events-list'>
                    {userData.events.length === 0 ? (
                        <p>You have no events yet. Create one to get started!</p>
                    ) : (
                        userData.events.map((event, index) => (
                            <div key={index} className="event-card">
                                <h3>{event.title}</h3>
                                <p>{event.date}</p>
                                <p>{event.description}</p>
                                {/* Placeholder for participant list or other event details */}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserEvents;
