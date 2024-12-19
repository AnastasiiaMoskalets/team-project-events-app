import React, { useEffect, useState } from "react";
import Event from "../Components/Event";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function Events() {
  const navigate = useNavigate();
  const [eventsData, setEventsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearch =async (e) =>{
    e.preventDefault()
    try {const response = await axios.get("http://localhost:5000/api/events/search", {
      params: { query: searchQuery }, // Pass the search query as a query parameter
    }, {
      withCredentials: true
    });

    if (response.status === 200) {
      setEventsData(response.data); // Update the events list with search results
    }
  
    } catch (error) {
      console.error("Error searching events", error);
    }
  }

  return (
    <div className="main-events-container">
      <form class="search-form" action="/search" method="GET" onSubmit={handleSearch}>
        <input type="text" name="query" placeholder="Search..." aria-label="Search" className="search-input"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-button" type="submit">
          <FontAwesomeIcon className="search-icon" icon={faMagnifyingGlass} />
        </button>
      </form>
      <div className="events-container">
        {eventsData.map(event => (
          <Event
            eventData={event}
            key={event._id}
            onClick={() => navigate(`/events/${event._id}`)} // Wrap navigate in a function
          />
        ))}
      </div>
    </div>
  );
}

export default Events;
