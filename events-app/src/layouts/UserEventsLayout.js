import React from "react";
import Navbar from "../Components/Navbar";
import { Outlet,useLocation, Link } from "react-router-dom";
function UserEventsLayout({ children }){
    const location = useLocation();
    
    return(
        <div id="main-user-events-container">
            <Navbar />
            <div className="tabs">
                <Link 
                    to="/userEvents" 
                    className={location.pathname === "/userEvents" ? "active-tab" : ""}
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
            <Outlet />
        </div>

    )
    
}
export default UserEventsLayout