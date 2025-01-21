import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Event from "../Components/Event";
import UserContext from "../UserContext";

function UserBookings() {
    const { userData } = useContext(UserContext);
    const [bookingsData, setBookingsData] = useState([]); // ✅ Fix: use empty array

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
                                showButtons={false}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserBookings;
