const{ Schema, model }=require("mongoose");
const UserSchema = new Schema(
    {
        email: {
            type: String, 
            required: true,
        },
        password: {
            type: String, 
            required: true, 
        },
        name: {
            type: String, 
            required: true,
        }
    }, 
    {
        timestamps: true
    }
);

// Export the model to use elseware.  
const User = model("User", UserSchema); 
module.exports = User; 
