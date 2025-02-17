import React, { createContext, useState, useCallback } from "react";
import axios from "axios";
import defaultImage from "./images/defaultProfile.png"

const apiUrl = process.env.REACT_APP_API_URL;
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const initialUserData = {
        username: "init",
        email: "init",
        profileImage: defaultImage,
        events:[]
  }

  const [userData, setUserData] = useState({ ...initialUserData });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  
  // Fetch user data from the API
  const fetchUserData = useCallback(async () => {
    try {
        const response = await axios.get(`${apiUrl}/api/users/profile-data`, {
            withCredentials: true
        });
        if (response.status === 200) {
            console.log("setting user data");
            setUserData({
                username: response.data.username,
                email: response.data.email,
                profileImage: response.data.profileImage,
                events: response.data.events
            });
            setIsLoggedIn(true);
        } else {
            setUserData(null);
            setIsLoggedIn(false);
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
    }
}, []);

 

  return (
    <UserContext.Provider value={{ userData, isLoggedIn, setIsLoggedIn, fetchUserData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
