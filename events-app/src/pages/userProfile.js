import React, { useState ,useEffect,useContext} from 'react';
import axios from 'axios';
import UserContext from "../UserContext";
import { FileUpload } from 'primereact/fileupload';
function UserProfile() {
    
    const [isEditable, setIsEditable] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const { userData, fetchUserData} = useContext(UserContext);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        profileImage: "",
    });
    useEffect(() => {
        if (userData) {
            console.log("data setting")
            setFormData({
                username: userData.username,
                email: userData.email,
                profileImage: userData.profileImage,
            });
        }
    }, [userData]);



    useEffect(() => {
        console.log('Updated formData:', formData);
    }, [formData]);  // This will trigger whenever formData changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        // Check if there are changes
        setIsUpdated(true);
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
      // Custom upload handler
      const customUploadHandler = async (event) => {
        const file = event.files[0]; // Get the selected file

        // Create FormData to send the file and email to the backend
        const uploadData = new FormData();
        uploadData.append("profileImage", file); // 'profileImage' is the expected field in your backend
        uploadData.append("email", formData.email); // Append the email from formData to the request

        try {
            const response = await axios.put(
                "http://localhost:5000/api/users/update-image", // Your backend URL
                uploadData,
                {
                    withCredentials: true, // Ensure cookies/session are sent along with the request
                    headers: {
                        "Content-Type": "multipart/form-data", // Set the correct content type for file uploads
                    },
                }
            );

            // If successful, update the profile image URL
            if (response.status === 200) {
                alert("Profile image updated successfully!");
                setFormData((prevData) => ({
                    ...prevData,
                    profileImage: response.data.profileImage, // Update the profile image with the new URL
                }));
                fetchUserData()
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload the image. Please try again.");
        }
    };

    return (
        <div className='user-container'>
            <h1 className='account-header'>User Account</h1>
            <div className='info-container'>
                <div className='image-container'>
                    <img className="profile-image" id='in-profile-image' src={formData.profileImage} alt="User Profile"/>
                    <FileUpload
                        key={formData.profileImage}
                        mode="basic"
                        name="profileImage"
                        customUpload
                        uploadHandler={customUploadHandler} 
                        accept="image/*"
                        auto
                        maxFileSize={1000000}
                        chooseLabel="Upload New Photo"
                    />
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
