require('dotenv').config();
const express = require('express');
const session = require('express-session');
const connectDB = require('./db');
const MongoStore = require('connect-mongo');  // Import MongoStore
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const cors = require('cors');
const path = require('path');
const bookingRoutes = require('./routes/bookingRoutes');


const app = express();


const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',  // replace with your frontend URL
    credentials: true
}));

// Middleware
app.use(express.json());  // Allows the server to parse incoming JSON requests

// Session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 7200 * 1000 },
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: 'sessions',
            ttl: 7200,  // Set session expiration time to 2 hours
        }),
        rolling: true  // This ensures that the session is refreshed on each request
    })
);



// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/public/user-images', express.static(path.join(__dirname, 'public/user-images')));

app.use('/api/bookings', bookingRoutes);

// Catch all errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



