import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const initialUserData = {
        username: "init",
        email: "init",
        profileImage: "init",
        events:[]
  }

  const [userData, setUserData] = useState({ ...initialUserData });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  


  // Fetch user data from the API
  const fetchUserData = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/users/profile-data", {
            withCredentials: true
        })
        if (response.status === 200) {
            console.log("setting user data")
            console.log(response.data)
            setUserData({
                username: response.data.username,
                email: response.data.email,
                profileImage: response.data.profileImage,
                events:response.data.events
            });
            setIsLoggedIn(true)

        } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoggedIn(false);
      setUserData(null);
    } 
  };


  // Call fetchUser when the provider mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, isLoggedIn, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
