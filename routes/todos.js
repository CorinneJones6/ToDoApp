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

//@route    POST /api/todos/new
//@desc     Create new todo
//@access   Private
router.post("/new", requiresAuth, async(req, res)=>{
    try {
        // Validate the input data for the todo.
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

        // Save the new todo item to the database.
        await newToDo.save(); 

        // Respond with the newly created todo item.
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
        // Fetch completed todo items for the current user, sorted by completion date.
        const completeToDos = await ToDo.find({
            user: req.user._id,
            complete: true,
        }).sort({completedAt: -1}); 

        // Fetch incomplete todo items for the current user, sorted by creation date.
        const incompleteToDos = await ToDo.find({
            user: req.user._id, 
            complete: false,
        }).sort({createdAt: -1}); 

        // Respond with both completed and incomplete todo items.
        return res.json({incomplete: incompleteToDos, complete: completeToDos});
    } 
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message); 
    }
}); 

//@route    PUT /api/todos/:toDoId/complete
//@desc     Mark a todo as complete
//@access   Private
router.put("/:toDoId/complete", requiresAuth, async(req, res)=>{
    try {
         // Attempt to find the todo item by ID and the current user's ID.
        const toDo = await ToDo.findOne({
            user: req.user._id,
            _id: req.params.toDoId
        }); 
        if(!toDo){
            return res.status(404).json({error: 'Could not find Todo'});
        }

         // If the todo item is already marked as complete, return a 400 status code with an error message.
        if(toDo.complete){
            return res.status(400).json({error: "ToDo is already complete"});
        }

        // Update the todo item to mark it as complete and set the completion date.
        const updatedToDo = await ToDo.findOneAndUpdate(
            {
               user: req.user._id, 
               _id: req.params.toDoId, 
            },
            {
                complete: true,
                completedAt: new Date(),
            }, 
            {
                new: true // Return the updated document.
            }
            
           );
           // Respond with the updated todo item.
           return res.json(updatedToDo); 
    } catch (error) {
        console.log(error); 
        return res.status(500).send(error.message); 
    }
});

//@route    PUT /api/todos/:toDoId/incomplete
//@desc     Mark a todo as incomplete
//@access   Private
router.put("/:toDoId/incomplete", requiresAuth, async (req, res) => {
    try {
           // Similar to the complete route, but marks the todo as incomplete and removes the completion date.
        const toDo = await ToDo.findOne({
            user: req.user._id,
            _id: req.params.toDoId,
        });

        if (!toDo) {
            return res.status(404).json({ error: "Could not find ToDo" });
        }

        if (!toDo.complete) {
            return res.status(400).json({ error: 'ToDo is already incomplete' });
        }

        const updatedToDo = await ToDo.findOneAndUpdate(
            {
                user: req.user._id,
                _id: req.params.toDoId,
            },
            {
                complete: false,
                completedAt: null // Remove this line
            },
            {
                new: true
            }
        );

        return res.json(updatedToDo);

    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
});

//@route    PUT /api/todos/:toDoId
//@desc     Update a todo
//@access   Private
router.put("/:toDoId", requiresAuth, async(req, res)=>{
    try {
          // Find the todo item belonging to the logged-in user with the specified ID.
        const toDo = await ToDo.findOne({

            user:req.user._id, // User ID from the authentication middleware.
            _id: req.params.toDoId // ToDo ID from the request parameters.
        }); 

        if (!toDo) {
            return res.status(404).json({ error: "Could not find ToDo" });
        }

         // Validate the input for updating the todo item.
        const{ isValid, errors }= validateToDoInput(req.body); 

        if(!isValid){
            return res.status(400).json(errors); 
        }

        // Update the todo item with the new content provided in the request body.
        const updatedToDo = await ToDo.findOneAndUpdate(
            {
                user: req.user._id, // Filter to match the document.
                _id: req.params.toDoId,
            },
            {
                content: req.body.content // Update operation.
            },
            {
                new: true // Return the updated document instead of the original.
            }
        );
            // Return the updated todo item.
            return res.json(updatedToDo); 
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message); 
    }
})

//@route    DELETE /api/todos/:toDoId
//@desc     Delete a todo
//@access   Private
router.delete("/:toDoId", requiresAuth, async(req, res)=>{
    try {
        // Find the todo item belonging to the logged-in user with the specified ID.
        const toDo = await ToDo.findOne({

            user:req.user._id, // User ID from the authentication middleware.
            _id: req.params.toDoId // ToDo ID from the request parameters.
        }); 

        if (!toDo) {
            return res.status(404).json({ error: "Could not find ToDo" });
        }

        // Delete the found todo item.
        await ToDo.findOneAndDelete({
            user: req.user._id,
            _id: req.params.toDoId,
        });

        // Return success response after deletion.
        return res.json({success: true}); 
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
})

module.exports = router; // Export the router for use in other parts of the application.