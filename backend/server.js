require('dotenv').config();
const express = require('express');
const session = require('express-session');
const connectDB = require('./db');
const MongoStore = require('connect-mongo');  // Import MongoStore
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());  // Allows the server to parse incoming JSON requests

// Session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },  // Set to true if using https
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,  // Use your MongoDB URI from .env
            collectionName: 'sessions',       // This is the collection that will store session data
            ttl: 14 * 24 * 60 * 60,           // Session expiration time (14 days)
        }),
    })
);

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);

// Catch all errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
