// backend/server.js
require('dotenv').config();


const express = require("express");
const connectDB = require("./db");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());  // Allows the server to parse incoming JSON requests

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/users", userRoutes);

// Catch all errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
