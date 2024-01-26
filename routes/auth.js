const express = require("express");
const router = express.Router(); 
const user = require("../models/User"); 
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validateRegisterInput = require("../validation/registerValidation"); 
const jwt = require('jsonwebtoken'); 
const requireAuth = require("../middleware/permission"); 

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
        const{errors, isValid} = validateRegisterInput(req.body); 

        if(!isValid){
            return res.status(400).json(errors); 
        }
        //check for existing user
        const existingEmail = await User.findOne({
            email: new RegExp("^" + req.body.email + "$", "i")
        }); 

        if(existingEmail){
            return res.status(400).json({error: "There is already a user with this email"});
        }

        //hash password 
        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        //create new user
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword, 
            name: req.body.name,
        });
        
        //save user to database
        const savedUser = await newUser.save(); 

        //create obj to spread the data and delete password
        const userToReturn = {...savedUser._doc};
        delete userToReturn.password; 

        //return new user
        return res.json(userToReturn);
    }
    catch(err){
        //error 
        console.log(err);

        res.status(500).send(err.message); 
    }
});

//@route    POST /api/auth/login
//@desc     Login user and return access token
//@access   Public
router.post("/login", async(req, res)=>{
    try {
        //check for user
        const user = await User.findOne({
            email: new RegExp("^" + req.body.email + "$", "i"),
        }); 

        if(!user){
            return res.status(400).json({error: "There was a problem with loging credentials"}); 
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password); 

        if(!passwordMatch){
            return res.status(400).json({error: "There was a problem with loging credentials"}); 
        }

        const payload = {userId: user._id}; 

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        //set a cookie
        res.cookie("access-token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true, 
            secure: process.env.NODE_ENV==="production"
        }); 

        const userToReturn = {...user._doc}; //spread the user
        delete userToReturn.password; 

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

router.get("/current", requireAuth, (req, res) =>{
    if(!req.user){
        return res.status(401).send("Unauthorized"); 
    }
    return res.json(req.user); 
}); 

module.exports = router; 