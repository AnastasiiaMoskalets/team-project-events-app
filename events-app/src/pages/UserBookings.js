import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Event from "../Components/Event";
import UserContext from "../UserContext";
import { useNavigate } from "react-router-dom";

function UserBookings() {
    const { userData } = useContext(UserContext);
    const [bookingsData, setBookingsData] = useState([]); 
    const navigate = useNavigate();

    const fetchBookings = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/bookings/my-bookings", { withCredentials: true });
            if (response.status === 200) {
                console.log("Setting bookings data:", response.data);
                setBookingsData(response.data);
            }
        } catch (error) {
            console.error(`Error fetching user bookings data: ${error}`);
        }
    };
    const handleShowDetails = (id) => {
        navigate(`/userEvents/bookingDetails/${id}`)
    }
    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <div className="user-events-page">
            <div className="user-info-container">
                <div className="user-events-header">
                    <h1 className="user-account-header">{userData.username}'s Bookings</h1>
                </div>
                <div className="user-events-list">
                    {bookingsData.length === 0 ? (
                        <p>You have no bookings yet. You can browse events on our main page.</p>
                    ) : (
                        bookingsData.map(booking => (
                            <Event
                                eventData={booking.eventId}
                                key={booking._id} // ✅ Correct unique key
                                showBookingsButtons={true}
                                onShowDetails={() => handleShowDetails(booking._id)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserBookings;
