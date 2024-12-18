import React from "react";
import NavBar from "../Components/Navbar";
import "./homeStyles.css"
import { Outlet } from "react-router-dom";

function HomeLayout({children}){
    return(
        <div id="main-home-container">
            <NavBar />
            <Outlet />
        </div>

    )
}

export default HomeLayout;