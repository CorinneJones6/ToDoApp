require("dotenv").config(); // load environment variables from .env file 
const express = require("express");
const mongoose = require("mongoose"); 

//import routes
const authRoute = require("./routes/auth");

const app = express(); 

app.use(express.json());
app.use(express.urlencoded()); 

// define a route that handles HTTP GET requests to the root URL "/"
app.get("/api", (req, res)=>{

    res.send("ToDoApp Server"); 
}); 


app.use("/api/auth", authRoute);

// connect to a MongoDB database using the URI in .env "MONGO_URI"
mongoose.connect(process.env.MONGO_URI).then(()=>{ 
    console.log('Connected to database');

    // start the Express.js server on the port defined in .env "PORT"
    app.listen(process.env.PORT, () => { 
        console.log(`Server is running on port ${process.env.PORT}`);
    });

}).catch((error)=> {
    console.log(error); 
});

