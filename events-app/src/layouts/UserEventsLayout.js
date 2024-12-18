import React from "react";
import Navbar from "../Components/Navbar";
import { Outlet } from "react-router-dom";
function UserEventsLayout({ children }){
    return(
        <div id="main-user-events-container">
            <Navbar />
            <Outlet />
        </div>

    )
    
}
export default UserEventsLayout