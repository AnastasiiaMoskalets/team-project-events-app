function generateEmailTemplate(username) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registration Confirmation</title>
        <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; background: linear-gradient(to right, #ff8a00, #e52e71); color: #333; }
            .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); }
            .header { padding: 20px; text-align: center; background-color: #f8f8f8; color: #e52e71; font-size: 24px; font-weight: bold; }
            .header img { width: 50px; height: 50px; vertical-align: middle; margin-right: 10px; }
            .hero-image { text-align: center; padding: 20px; }
            .hero-image img { width: 150px; }
            .content { padding: 20px; text-align: center; font-size: 16px; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #888; background-color: #f8f8f8; }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <img src="cid:logoImage" alt="Logo">
                Events app<br>Have fun with us!
            </div>
            <div class="hero-image">
                <img src="cid:heroImage" alt="Character Image">
            </div>
            <div class="content">
                <p>Hello ${username},</p>
                <p>Thank you for registering at our site!</p>
            </div>
            <div class="footer">
                � 2024 Events app. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
}
module.exports = generateEmailTemplate;
