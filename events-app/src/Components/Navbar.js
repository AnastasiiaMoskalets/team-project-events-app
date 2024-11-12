import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import defaultProfile from "../images/defaultProfile.png"

const Navbar = () => {
 return (
  <header>

    <nav className="navbar">
      <h1 className="app-name">Event app</h1>
      <ul className="navbar-links">
        <li>
          <NavLink 
            to="/events"
            className={({ isActive }) => (isActive ? "active" : "nav-link")}
          >
            Browse events
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/Dashboard"
            className={({ isActive }) => (isActive ? "active" : "nav-link")}
          >
            My events
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/user"
            className={({ isActive }) => (isActive ? "active" : "nav-link")}
          >
              <img className="profile-image" src={defaultProfile}/>
          </NavLink>
        </li>

      </ul>
    </nav>
  </header>
 );
};

export default Navbar;