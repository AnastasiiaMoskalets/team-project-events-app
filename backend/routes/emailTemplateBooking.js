function generateBookingEmailTemplate(username, eventName, eventDate, eventLocation) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Booking Confirmation</title>
        <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; background: linear-gradient(to right, #4facfe, #00f2fe); color: #333; }
            .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); }
            .header { padding: 20px; text-align: center; background-color: #f8f8f8; color: #00f2fe; font-size: 24px; font-weight: bold; }
            .header img { width: 50px; height: 50px; vertical-align: middle; margin-right: 10px; }
            .hero-image { text-align: center; padding: 20px; }
            .hero-image img { width: 150px; }
            .content { padding: 20px; text-align: center; font-size: 16px; }
            .event-details { background-color: #f0f8ff; padding: 15px; margin: 20px auto; border-radius: 10px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1); }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #888; background-color: #f8f8f8; }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <img src="cid:logoImage" alt="Logo">
                Events app<br>We look forward to seeing you!
            </div>
            <div class="hero-image">
                <img src="cid:heroImage" alt="Event Image">
            </div>
            <div class="content">
                <p>Hello ${username},</p>
                <p>Your booking has been confirmed for the following event:</p>
                <div class="event-details">
                    <p><strong>Event Name:</strong> ${eventName}</p>
                    <p><strong>Date:</strong> ${eventDate}</p>
                    <p><strong>Location:</strong> ${eventLocation}</p>
                </div>
                <p>We are excited to have you join us!</p>
            </div>
            <div class="footer">
                &copy; 2024 Events app. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
}

module.exports = generateBookingEmailTemplate;
