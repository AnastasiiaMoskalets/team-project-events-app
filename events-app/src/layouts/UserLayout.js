import React from "react";
import NavBar from "../Components/Navbar";
import UserProfile from "../pages/UserProfile"
import "./userStyles.css"

function UserLayout(){
    return(
        <div id="main-user-container">
            <NavBar />
            <UserProfile />
        </div>

    )
    
}

export default UserLayout;