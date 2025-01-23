import React from 'react';
import { Outlet, useLocation , Link } from 'react-router-dom';
function UserEvents() {
    const location = useLocation()
    return(
        <div id='user-events-container'>
            <div className="tabs">
                    <Link 
                        to="/userEvents/userCreatedEvents" 
                        className={location.pathname === "/userEvents/userCreatedEvents" ? "active-tab" : ""}
                    >
                    Created Events
                    </Link>
                    <Link 
                        to="/userEvents/userBookings" 
                        className={location.pathname === "/userEvents/userBookings" ? "active-tab" : ""}
                    >
                    Booked Events
                    </Link>
            </div>
            <Outlet/>
        </div>
    )
}

export default UserEvents;
