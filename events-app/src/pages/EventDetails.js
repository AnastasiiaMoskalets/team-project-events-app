import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect} from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleLeft} from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

function EventDetails(){
  const navigate = useNavigate();
  const { id } = useParams();
  const [eventData, setEventData] = useState([]);
  const imageUrl = `http://localhost:5000${eventData.eventImage}`
  const fetchEventData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/events/${id}`, {
        withCredentials: true
      });
      if (response.status === 200) {
        console.log(response.data)
        setEventData(response.data);
      }
    } catch (error) {
      console.error("Error fetching events data:", error);
    }
  };
  useEffect(() => {
      fetchEventData();
    }, []);
    const eventDate = new Date(eventData.date);
    const dayName = eventDate.toLocaleString('en-US', { weekday: 'long' });
    const monthIndex = eventDate.getMonth(); 
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayOfMonth = eventDate.getDate();
    const time = new Date(`1970-01-01T${eventData.time}Z`).toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    const year = eventDate.getFullYear()

    
    return (
      <div className="event-details-container">
        <div
          className="event-image"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(http://localhost:5000${eventData.eventImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          
        >
          <div className="event-details-container-left">
            <div className="back-button" style={{
              color: "white"
            }} onClick={() => navigate("/")}>
              <FontAwesomeIcon icon={faAngleLeft} style={{
              color: "white"
            }} />
              <p>
              Back
              </p>
            </div>
            <div className="event-details-container-left-2">
              <h2 className="event-title" style={{
                color:  "white"
              }}>
                {eventData.title}
              </h2>
              <p className="event-location" style={{
                color: "white"
              }}>
                <span className="event-location-icon"><FontAwesomeIcon icon={faLocationDot} /></span>
                {eventData.location}
              </p>
              <p className="event-organizer-name" style={{
                color: "white"
              }}>contact organizer: {eventData.organizerEmail}
              </p>
            </div>
          </div>
          <div className="event-details-container-right">
            <h3 className="date-time">
              Date & Time
            </h3>
            <p className="date-time-text">
              {dayName}, {months[monthIndex]} {dayOfMonth}, {year} at {time}
            </p>
            <p className="price-text"><span className="details-tag">Price:</span> ${eventData.price}</p>
            <p className="spots-text"><span className="details-tag">Currently spots available:</span> {eventData.availableSpots}</p>
          </div>
        </div>
        <div className="event-description-container">
          <h3 className="description-title">
            Description
          </h3>
          <p className="description-text">
            {eventData.description}
          </p>
        </div>
      </div>
    );
}

export default EventDetails