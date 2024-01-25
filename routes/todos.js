const express = require('express'); 
const router = express.Router(); 
const ToDo = require("../models/ToDo"); 

//@route    GET /api/todos/test
//@desc     Test the todos route
//@access   Public
router.get("/test", (req, res)=>{
    res.send("Todo route working"); 
}); 

//@route    POST /api/todos/test
//@desc     Create new todo
//@access   Private
router.post("/new", async(req, res)=>{
    try {
        //create a new todo
        const newToDo = new ToDo({
            user: req.user._id,
            content: req.body.content, 
            complete: false,
        });
        //save the new todo
        await newToDo.save(); 
        return res.json(newToDo); 
    } catch (err) {
        return res.status(500).send(err.message);
    }
}); 

module.exports = router; 