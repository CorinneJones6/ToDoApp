require("dotenv").config(); // load environment variables from .env file 
const express = require("express");
const mongoose = require("mongoose"); 
const cookieParser = require("cookie-parser"); 

//import routes
const authRoute = require("./routes/auth");
const toDosRoute = require("./routes/todos"); 

const app = express(); 

app.use(express.json());
app.use(express.urlencoded()); 
app.use(cookieParser()); 

// define a route that handles HTTP GET requests to the root URL "/"
app.get("/api", (req, res)=>{

    res.send("ToDoApp Server"); 
}); 


app.use("/api/auth", authRoute);
app.use("/api/todos", toDosRoute);

// connect to a MongoDB database using the URI in .env variable "MONGO_URI"
mongoose.connect(process.env.MONGO_URI).then(()=>{ //connect to database first
    console.log('Connected to database');

    // start the Express.js server on the port defined in .env "PORT"
    app.listen(process.env.PORT, () => { 
        console.log(`Server is running on port ${process.env.PORT}`);
    });

}).catch((error)=> {
    console.log(error); 
});

