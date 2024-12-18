import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import UserContext from "../UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'; // Import the specific icon
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const { userData, isLoggedIn, setIsLoggedIn} = useContext(UserContext);

  const logout = async () => {
    try{
      const response = axios.post("http://localhost:5000/api/users/logout",{
        withCredentials: true
      })
        setIsLoggedIn(false)
        console.log("res got from logout", response.status)
        navigate('/')
    }catch(error){
      console.error("Error logging out:", error)
    }
  }

  return (
    <header>
      <nav className="navbar">
        <h1 className="app-name">Event app</h1>
        <ul className="navbar-links">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "nav-link")}>
              Browse events
            </NavLink>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <NavLink to="/userEvents" className={({ isActive }) => (isActive ? "active" : "nav-link")}>
                  My events
                </NavLink>
              </li>
              <li>
                <NavLink to="/user" className={({ isActive }) => (isActive ? "active" : "nav-link")}>
                  <img className="profile-image" src={userData.profileImage} alt="User Profile" />
                </NavLink>
              </li>
              <li id="iconLi">
                {/* Use the icon here */}
                <FontAwesomeIcon onClick={logout} icon={faArrowRightFromBracket} style={{ color: "#ffffff" }} />
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/auth/login" className={({ isActive }) => (isActive ? "active" : "nav-link")}>
                  Log in
                </NavLink>
              </li>
              <li>
                <NavLink to="/auth/register" className={({ isActive }) => (isActive ? "active" : "nav-link")}>
                  Create Account
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
