import React, { useState } from 'react';
import defaultProfile from "../images/defaultProfile.png"

function UserProfile() {
    const initialUserData = {
        userName: "UserName UserSurname",
        userEmail: "user@gmail.com",
    };

    const [formData, setFormData] = useState({ ...initialUserData });
    const [isEditable, setIsEditable] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        
        // Check for changes relative to initial data
        setIsUpdated(
            value !== initialUserData[name] ||
            formData.userName !== initialUserData.userName ||
            formData.userEmail !== initialUserData.userEmail
        );
    };

    const enableEditing = () => {
        setIsEditable(true);
    };

    const updateUserProfile = () => {
        setIsEditable(false);
        setIsUpdated(false);
        // Instead of mutating `initialUserData`, use setFormData directly for updating
        setFormData((prevData) => ({ ...prevData }));
    };

    return (
        <div className='user-container'>
            <h1 className='account-header'>User Account</h1>
            <div className='info-container'>
                <div className='image-container'>
                    <img className="profile-image" id='in-profile-image' src={defaultProfile} alt="User Profile"/>
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
                            name="userName"
                            value={formData.userName}
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
                            name="userEmail"
                            value={formData.userEmail}
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
