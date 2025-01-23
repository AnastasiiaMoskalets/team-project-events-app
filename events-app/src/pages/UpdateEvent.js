import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../layouts/createEventStyles.css";
import UserContext from "../UserContext";

function UpdateEvent() {
    const { id } = useParams();
    const initialEventData = {
        title :"",
        description:"",
        date:"",
        time:"",
        location:"",
        maxSpots:"",
        price:"",
        eventImage: null
    }
    const {fetchUserData} = useContext(UserContext)
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialEventData);
    const [newImage, setNewImage] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const fetchEventData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/events/${id}`, {
                withCredentials: true
            })
            if (response.status === 200) {
                console.log("setting event data")
                console.log(response.data)
                setFormData({
                    title: response.data.title,
                    description: response.data.description,
                    date: response.data.date ? response.data.date.split('T')[0] : "",
                    time:response.data.time,
                    location: response.data.location,
                    maxSpots: response.data.maxSpots,
                    price: response.data.price,
                    eventImage: response.data.eventImage
                });
    
            } else {
            setFormData(null);
          }
        } catch (error) {
          console.error("Error fetching event data:", error);
          setFormData(null);
        } 
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

    };  
    useEffect(() => {
        fetchEventData()
    }, []);
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        // Set the new image preview URL
        const imageUrl = URL.createObjectURL(file);
        setFormData((prevData) => ({ ...prevData, eventImage: imageUrl }));
        
        // Set the new image to the state for future upload
        setNewImage(file);
    };
    
    
    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        
        try {
            // Only upload the image if it has changed
            if (newImage) {
                const formData2 = new FormData();
                formData2.append("eventImage", newImage);  // Append the image to FormData
    
                const image_response = await axios.put(
                    `http://localhost:5000/api/events/update-image/${id}`,
                    formData2,  // Send only the image as FormData
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",  // Ensure correct content type for file upload
                        },
                        withCredentials: true,
                    }
                );
    
                if (image_response.status === 200) {
                    console.log("Image updated successfully");
                    setSuccessMessage("Image updated successfully");
                }
            }
            
            // Update event details
            const response = await axios.put(`http://localhost:5000/api/events/update/${id}`, formData,  {
                withCredentials: true
            });
    
            if (response.status === 200) {
                navigate("/userEvents");
                fetchUserData();
                console.log("Event updated successfully");
                setSuccessMessage("Event updated successfully");
            }
        } catch (error) {
            console.error("Error updating event:", error);
            setErrorMessage("Error updating event");
        }
    };
    
    return(
        <div className="event-body">
            <div className="event-info-container">
                <h1 className="event-h1">Update an Event</h1>
                <form onSubmit={handleUpdateEvent} className="event-form">
                    <div className="event-form-group">
                        <div className="add-image-container">
                            {formData.eventImage ? (
                                <img
                                    src={formData.eventImage.startsWith("blob:") ? formData.eventImage : `http://localhost:5000${formData.eventImage}`}
                                    alt="Event"
                                    className="image-preview"
                                />
                                ) : (
                                    <p>No image available</p>
                            )}
                            <button
                                type="button"
                                className="event-button add-image-button"
                                onClick={() => document.getElementById("eventImage").click()}
                            >
                                Upload New Image
                            </button>
                        </div>
                        <input
                            type="file"
                            id="eventImage"
                            name="eventImage"
                            onChange={handleImageChange}
                            accept="image/*"
                            style={{ display: "none" }} // Hides the default file input
                        />
                    </div>

                    <div className="event-form-group title-price-container">
                        <div className="input-container">
                            <label className="form-label" htmlFor="title">Event Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Enter event title"
                                value={formData.title}
                                onChange={handleChange}
                                className="event-profile-input"
                                required
                            />
                        </div>
                        <div className="input-container">
                            <label className="form-label" htmlFor="price">Price ($)</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                placeholder="Enter price"
                                value={formData.price}
                                onChange={handleChange}
                                className="event-profile-input"
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="event-form-group input-container create-event-input-container ">
                        <label className="form-label" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Enter event description"
                            value={formData.description}
                            onChange={handleChange}
                            className="event-profile-input"
                            rows="4"
                            required
                        />
                    </div>

                    <div className="date-time-container">
                        <div className="input-container create-event-input-container">
                            <label className="form-label" htmlFor="date">Event Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="event-profile-input"
                                required
                            />
                        </div>
                        <div className="input-container create-event-input-container">
                            <label className="form-label" htmlFor="time">Event Time</label>
                            <input
                                type="time"
                                id="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="event-profile-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="location-spots-container ">
                        <div className="input-container create-event-input-container">
                            <label className="form-label" htmlFor="location">Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                placeholder="Enter event location"
                                value={formData.location}
                                onChange={handleChange}
                                className="event-profile-input"
                                required
                            />
                        </div>
                        <div className="input-container create-event-input-container">
                            <label className="form-label" htmlFor="maxSpots">Maximum Spots</label>
                            <input
                                type="number"
                                id="maxSpots"
                                name="maxSpots"
                                placeholder="Enter maximum spots"
                                value={formData.maxSpots}
                                onChange={handleChange}
                                className="event-profile-input"
                                required
                                min="1"  
                            />

                        </div>
                    </div>

                    {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

                    <button type="submit" className="event-button">
                        Update Event
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UpdateEvent;
