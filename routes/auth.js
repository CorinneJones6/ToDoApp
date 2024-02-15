const express = require("express");
const router = express.Router(); 
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validateRegisterInput = require("../validation/registerValidation"); 
const jwt = require('jsonwebtoken'); 
const requiresAuth = require("../middleware/permission"); 

//@route    GET /api/auth/test
//@desc     Test the auth route
//@access   Public
router.get("/test", (req, res)=>{
    res.send("Auth route working")
}); 

//@route    POST /api/auth/register
//@desc     Create a new user
//@access   Public
router.post("/register", async(req, res)=>{
    try{
        // Validation of input fields
        const{errors, isValid} = validateRegisterInput(req.body); 

        // Return validation errors if input is not valid
        if(!isValid){
            return res.status(400).json(errors); 
        }
       
         // Check if the email is already in use
        const existingEmail = await User.findOne({
            email: new RegExp("^" + req.body.email + "$", "i") //^ is start, $ is end, i says ignore case differences
        }); 

        // If email exists, return an error
        if(existingEmail){
            return res.status(400).json({error: "There is already a user with this email"});
        }

        // Hash the password before saving it in the database
        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        // Create a new user instance
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword, 
            name: req.body.name,
        });
        
        // Save the new user in the database
        const savedUser = await newUser.save(); 

         // Create a token payload with the user's ID
        const payload = {userId: savedUser._id}; 

        // Sign the token with a secret key
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        // Set the token as an HTTP-only cookie
        res.cookie("access-token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true, 
            secure: process.env.NODE_ENV==="production"
        }); 

        // Prepare the user object to return, excluding the password
        const userToReturn = {...savedUser._doc};
        delete userToReturn.password; 

        // Return the new user data
        return res.json(userToReturn);
    }
    catch(error){
        //error 
        console.log(error);

        res.status(500).send(error.message); 
    }
});

//@route    POST /api/auth/login
//@desc     Login user and return access token
//@access   Public
router.post("/login", async(req, res)=>{
    try {
         // Attempt to find a user in the database with the provided email, ignoring case sensitivity.
        const user = await User.findOne({
            email: new RegExp("^" + req.body.email + "$", "i"),
        }); 

         // If no user is found, return an error indicating the login credentials are incorrect.
        if(!user){
            return res.status(400).json({error: "There was a problem with loging credentials"}); 
        }

        // Check if the provided password matches the hashed password stored in the database.
        const passwordMatch = await bcrypt.compare(req.body.password, user.password); 

        // If the passwords do not match, return an error indicating the login credentials are incorrect.
        if(!passwordMatch){
            return res.status(400).json({error: "There was a problem with loging credentials"}); 
        }

         // Create a payload with the user's ID for the JWT token.
        const payload = {userId: user._id}; 

        // Sign the JWT token with the user's ID and set it to expire in 7 days.
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        // Set the signed JWT token as an HTTP-only cookie to enhance security.
        res.cookie("access-token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true, 
            secure: process.env.NODE_ENV==="production"
        }); 

        // Prepare the user object to return, excluding the password for security.
        const userToReturn = {...user._doc}; //spread the user
        delete userToReturn.password; 

        // Return the user object and the token as the response.
        return res.json({
            token: token, 
            user: userToReturn,
        }); 

        // return res.json({passwordMatch: passwordMatch}); 
    } catch (error) {
        console.log(error); 

        return res.status(500).send(error.message); 
    }
}); 

//@route    GET /api/current
//@desc     Return the currently authed user
//@access   Private

router.get("/current", requiresAuth, (req, res) =>{
    // Check if the request has been successfully authenticated by the middleware.
    if(!req.user){
        return res.status(401).send("Unauthorized"); 
    }
     // Return the authenticated user's information.
    return res.json(req.user); 
}); 

//@route    PUT /api/logout
//@desc     log out a user and clear the access-token cookie
//@access   Private
router.put("/logout", async(req, res)=>{
    try {
        // Clear the access-token cookie, effectively logging the user out.
        res.clearCookie("access-token"); 
        // Return a success response.
        return res.json({success: true}); 
    } catch (error) {
        console.log(error); 
        return res.status(500).send(error.message);
    }
});

module.exports = router; 