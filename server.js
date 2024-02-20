// Import the necessary modules from the installed packages
require("dotenv").config(); // Load environment variables from .env file 

const express = require("express"); // Import Express framework
const mongoose = require("mongoose"); // Import Mongoose for MongoDB interactions
const cookieParser = require("cookie-parser"); // Import cookie-parser to parse cookie header and populate req.cookies
const path = require("path"); // Import Path module for handling and transforming file paths

// Import routes
const authRoute = require("./routes/auth"); // Routes for authentication
const toDosRoute = require("./routes/todos"); // Routes for todo items


const app = express(); // Initialize Express app

// Middleware
app.use(express.json()); // Parse JSON bodies in requests
app.use(express.urlencoded()); // Parse URL-encoded bodies
app.use(cookieParser()); // Use cookie-parser middleware

// Define a route that handles HTTP GET requests to the root URL "/"
app.get("/api", (req, res)=>{

    res.send("ToDoApp Server"); 
}); 


app.use("/api/auth", authRoute);
app.use("/api/todos", toDosRoute);

// Serve static files from the React build directory
app.use(express.static(path.resolve(__dirname, "./client/build"))); 

// All unspecified routes should serve the React app
app.get("*", (req, res)=>{
    res.sendFile(path.resolve(__dirname, "./client/build", "index.html")); 
}); 

// Connect to a MongoDB database using the URI in .env variable "MONGO_URI"
mongoose.connect(process.env.MONGO_URI).then(()=>{ // Connect to database
    console.log('Connected to database');

    // Start the Express.js server on the port defined in .env "PORT"
    app.listen(process.env.PORT, () => { 
        console.log(`Server is running on port ${process.env.PORT}`);
    });

}).catch((error)=> {
    console.log(error); // Log connection errors
});

