const User = require("../models/User"); // Import the User model to interact with the user data in the database.
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library to work with JSON Web Tokens.

// Define an asynchronous middleware function to require authentication.
const requireAuth = async(req, res, next) =>{
    // Retrieve the 'access-token' cookie from the request.
    const token = req.cookies["access-token"]; 
    // Initialize a flag to keep track of authentication status.
    let isAuthed = false; 

    // If a token is present, proceed with verification.
    if(token){
        try {
            // Verify the token using the JWT secret key and extract the userId.
            const{userId}=jwt.verify(token, process.env.JWT_SECRET); 
            try {
                // Attempt to find the user in the database using the userId.
                const user = await User.findById(userId); 
                // If a user is found, prepare the user object for the request, excluding the password.
                if(user){
                    const userToReturn = {...user._doc}; //Spread the user. 
                    delete userToReturn.password; // Remove the password for security.
                    req.user = userToReturn; // Attach the user object to the request.
                    isAuthed=true; // Set authentication flag to true.
                }
            } catch{
                 // If an error occurs during user lookup, set authentication to false.
                isAuthed = false; 
            }
        
        }catch {
              // If token verification fails, set authentication to false.
            isAuthed = false; 
        }
    }
    if(isAuthed){
        // If authentication is successful, call next() to pass control to the next route handler.
        return next(); 
    }else {
        return res.status(401).send("Unauthorized"); 
    }
}; 

module.exports=requireAuth; 