import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../layouts/userEventsStyles.css";
import { useNavigate } from 'react-router-dom';
import Event from '../Components/Event';

function UserEvents() {
    const [userData, setUserData] = useState({
        username: "loading...",
        events: []
    });

    const [isLoading, setIsLoading] = useState(true);  // Loading state
    const [error, setError] = useState(null);  // Error state
    const navigate = useNavigate()

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
        navigate("/userEvents/createEvent")
    };

    if (isLoading) {
        return <div>Loading...</div>;  // Show loading message while data is being fetched
    }

    if (error) {
        return <div>{error}</div>;  // Show error message if something went wrong
    }

    return (
        <div className="user-events-page">
            <div className='user-info-container'>
                <div className='user-events-header'>
                    <h1 className='user-account-header'>{userData.username}'s Dashboard</h1>
                    <button
                    onClick={handleCreateEventClick}
                    id="user-update-image-button"
                    >
                        Create Event
                    </button>
                </div>
                <div className='user-events-list'>
                    {userData.events.length === 0 ? (
                        <p>You have no events yet. Create one to get started!</p>
                    ) : (
                        userData.events.map(event => (
                            <Event
                            eventData={event}
                            key={event._id}
                            />
                        ))
                )}
                </div>
            </div>
        </div>
    );

}

export default UserEvents;
