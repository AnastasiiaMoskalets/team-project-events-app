import React, { useState ,useEffect } from 'react';
import defaultProfile from "../images/defaultProfile.png"
import axios from 'axios';

function UserProfile() {
    const initialUserData = {
        username: "init",
        email: "init",
        profileImage: "init"
    };

    const [formData, setFormData] = useState({ ...initialUserData });
    const [isEditable, setIsEditable] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/users/profile-data", {
                    withCredentials: true
                });
                console.log(response.data.username);
                if (response.status === 200) {
                    console.log("setting user data")
                    setFormData({
                        username: response.data.username,
                        email: response.data.email,
                        profileImage: response.data.profileImage
                    });
                    console.log(formData);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } //finally {
                //setLoading(false);
           // }
        };
        fetchUserData();
    }, []);


    useEffect(() => {
        console.log('Updated formData:', formData);
    }, [formData]);  // This will trigger whenever formData changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        // Check if there are changes
        setIsUpdated(
            value !== initialUserData[name] ||
            formData.username !== initialUserData.username ||
            formData.email !== initialUserData.email
        );
    };

    const enableEditing = () => {
        setIsEditable(true);
    };

    const updateUserProfile = async () => {
        setIsEditable(false);
        setIsUpdated(false);
        // Instead of mutating `initialUserData`, use setFormData directly for updating
        try {
            const response = await axios.put("http://localhost:5000/api/users/update-profile", formData,  {
                withCredentials: true
            });
            if (response.status === 200) {
                setIsEditable(false);
                setIsUpdated(false);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
        
    };

    return (
        <div className='user-container'>
            <h1 className='account-header'>User Account</h1>
            <div className='info-container'>
                <div className='image-container'>
                    <img className="profile-image" id='in-profile-image' src={formData.profileImage} alt="User Profile"/>
                    <button id='update-image-button'>
                        Upload new photo
                    </button>
                    <button id='remove-image-button'>
                        Remove
                    </button>
                </div>
                <form id='user-info-form'>
                    <div className="profile-input-container input-container ">
                        <label htmlFor="userName" className="form-label profile-form-label">User Name</label>
                        <input
                            type="text"
                            id="user-name"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            readOnly={!isEditable}
                            disabled={!isEditable}
                            className="form-input profile-input"
                        />
                    </div>
                    <div className="profile-input-container input-container " >
                        <label htmlFor="userEmail" className="form-label profile-form-label">User email</label>
                        <input
                            type="text"
                            id="user-email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            readOnly={!isEditable}
                            disabled={!isEditable}
                            className="form-input profile-input"
                        />
                    </div>
                    <div className='profile-buttons-container'>
                        <button type="button" onClick={enableEditing} disabled={isEditable} id='edit-button'>
                            Edit
                        </button>
                        <button type="button" onClick={updateUserProfile} disabled={!isUpdated} id='update-button'>
                            Update Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserProfile;
