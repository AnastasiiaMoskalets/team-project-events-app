import React , {useState}from "react";

function Event({ eventData, onClick, onDelete, onUpdate, showButtons }){
    const dateString = eventData.date;
    const date = new Date(dateString);
    const day = date.getDate(); 
    const monthIndex = date.getMonth(); 
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return(
    <div 
        className="event-container" onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
        <div className="event-image-container" style={{
        backgroundImage: `url(http://localhost:5000${eventData.eventImage})`,
        backgroundSize: "cover", 
        backgroundPosition: "center",
        height: '170px'
         
      }}>
            <p className="event-price">${eventData.price}</p>
            {showButtons && (
           isHovered && (
            <div className="event-overlay">
              <button onClick={onDelete}>Delete</button>
              <button onClick={onUpdate}>Update</button>
            </div>
          )
        )}
        </div>
        <div className="event-description-container">
            <div className="event-date-container">
                <p className="event-month">
                    {months[monthIndex]}
                </p>
                <p className="event-day">
                    {day}
                </p>
            </div>
            <div className="event-details-description">
                <h3 className="event-title">
                    {eventData.title}
                </h3>
                <p className="event-location">
                    {eventData.location}
                </p>
            </div>
        </div>
    </div>
    )
}

export default Event;