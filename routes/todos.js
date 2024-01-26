const express = require('express'); 
const router = express.Router(); 
const ToDo = require("../models/ToDo");
const requiresAuth = require("../middleware/permission"); 
const validateToDoInput = require("../validation/toDoValidation"); 

//@route    GET /api/todos/test
//@desc     Test the todos route
//@access   Public
router.get("/test", (req, res)=>{
    res.send("Todos route working"); 
});

//@route    POST /api/todos/test
//@desc     Create new todo
//@access   Private
router.post("/new", requiresAuth, async(req, res)=>{
    try {
        const {isValid, errors} = validateToDoInput(req.body); 
        if(!isValid){
            return res.status(400).json(errors); 
        }
        //create a new todo
        const newToDo = new ToDo({
            user: req.user._id,
            content: req.body.content, 
            complete: false,
        });

        //save the new todo
        await newToDo.save(); 
        return res.json(newToDo); 
    } 
    catch (error) {
        console.log(error); 
        return res.status(500).send(error.message);
    }
}); 

//@route    GET /api/todos/current
//@desc     Current users todos
//@access   Private
router.get("/current", requiresAuth, async(req, res)=>{
    try {
        const completeToDos = await ToDo.find({
            user: req.user._id,
            complete: true,
        }).sort({completedAt: -1}); 

        const incompleteToDos = await ToDo.find({
            user: req.user._id, 
            complete: false,
        }).sort({createdAt: -1}); 

        return res.json({incomplete: incompleteToDos, complete: completeToDos});
    } 
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message); 
    }
}); 

module.exports = router; 