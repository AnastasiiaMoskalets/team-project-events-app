import axios from "axios";
import React, {useEffect, useState} from "react";
import { useParams, useNavigate} from "react-router-dom";
import Navbar from "../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faClock } from "@fortawesome/free-solid-svg-icons";

function BookingDetails(){
    const apiUrl = process.env.REACT_APP_API_URL;
    const { id } = useParams();
    const [formData, setFormData] = useState({
        eventId: {
            title:"",
            price:"",
            location:"",
            time:"",
            eventImage: null
        },
        firstName: "",
        lastName: "",
        phoneNumber: "",
        contactEmail: "",
    })
    const navigate = useNavigate();
    const fetchBookingDetails = async () => {
        try{
            const response = await axios.get(`${apiUrl}/api/bookings/${id}`,{
                withCredentials:true
            })
            
            if(response.status === 200){
                console.log(response.data.eventId.eventImage)
                setFormData({
                    eventId: {
                        title: response.data.eventId.title,
                        price: response.data.eventId.price,
                        location: response.data.eventId.location,
                        time: response.data.eventId.time,
                        eventImage: response.data.eventId.eventImage
                    },
                    firstName:response.data.firstName,
                    lastName:response.data.lastName,
                    phoneNumber:response.data.phoneNumber,
                    contactEmail:response.data.contactEmail
                })
            }
        }catch(error){
            console.error(`Error fetching booking details data: ${error}`)
            alert("Error fetching booking details data")
        }
    }
    useEffect(() => {
        fetchBookingDetails();
    },[])
    const handleCancel = async () => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
        if(!confirmCancel){
            return
        }
        try{
            const response = await axios.delete(`${apiUrl}/api/bookings/cancel/${id}`, {
                withCredentials: true
            })
            if(response.status === 200){
                alert("Booking successfully canceled!");
                navigate("/userEvents/userBookings")
            }

        }catch(error){
            console.error(`Error canceling the event:${error}`)
            alert("Failed to cancel booking. Please try again.");
        }
    }
    return(
    <div className="booking-body">
            <Navbar />
            <div className="forms-container">
                <h1 className="booking-h1">Personal Information</h1>
                <form className="bookings-form">
                    <div className="booking-form-group">
                        <label htmlFor="firstName" className="forms-label">FIRST NAME</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            className="booking-input"
                            required
                            disabled
                        />
                    </div>
                    <div className="booking-form-group">
                        <label htmlFor="lastName" className="forms-label">LAST NAME</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            className="booking-input"
                            required
                            disabled
                        />
                    </div>
                    <div className="booking-form-group">
                        <label htmlFor="email" className="forms-label">YOUR EMAIl</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.contactEmail}
                            className="booking-input"
                            required
                            disabled
                        />
                    </div>
                    <div className="booking-form-group">
                        <label htmlFor="phoneNumber" className="forms-label">PHONE NUMBER</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            className="booking-input"
                            required
                            disabled
                        />
                    </div>
                </form>
                <button onClick={handleCancel} className="event-button">Cancel booking</button>
            </div>
            <div className="summary-container">
                    <img src={`${apiUrl}${formData.eventId.eventImage}`} alt="Event" className="booking-event-image" />
                
                <h2 className="summary-title">
                    <FontAwesomeIcon icon={faLocationDot} /> Event Summary
                </h2>
                
                <div className="summary-details">
                    <p>{formData.eventId.title}</p>
                    <p>Price: ${formData.eventId.price}</p>
                </div>
                <h2 className="summary-title">
                    <FontAwesomeIcon icon={faLocationDot} /> Location
                </h2>
                <div className="summary-details">
                    <p>{formData.eventId.location}</p>
                </div>
                <h2 className="summary-title">
                    <FontAwesomeIcon icon={faClock} /> Hours
                </h2>
                <div className="summary-details">
                    <p>{formData.eventId.time}</p>
                </div>
            </div>
        </div>
)
}
export default BookingDetails