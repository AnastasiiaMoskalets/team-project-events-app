import React from "react";
import NavBar from "../Components/Navbar";
import Events from "../pages/Events"
import UserLayout from "./UserLayout";

function HomeLayout(){
    return(
        <div id="main-home-container">
            <NavBar />
            <p>Hi from home</p>
            <Events />
        </div>

    )
}

export default HomeLayout;