import React, { useEffect, useState } from "react";
import Event from "../Components/Event";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Events() {
  const navigate = useNavigate();
  const [eventsData, setEventsData] = useState([]);

  const fetchEventsData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/events/all", {
        withCredentials: true
      });
      if (response.status === 200) {
        console.log(response.data)
        setEventsData(response.data);
      }
    } catch (error) {
      console.error("Error fetching events data:", error);
    }
  };

  useEffect(() => {
    fetchEventsData();
  }, []);

  return (
    <div className="events-container">
      {eventsData.map(event => (
        <Event
          eventData={event}
          key={event._id}
          onClick={() => navigate(`/events/${event._id}`)} // Wrap navigate in a function
        />
      ))}
    </div>
  );
}

export default Events;
