import React from "react";
import Navbar from "../Components/Navbar";

function UserEventsLayout({ children }){
    return(
        <div id="main-user-events-container">
            <Navbar />
            <p>Hi from user events</p>
        </div>

    )
    
}
export default UserEventsLayout