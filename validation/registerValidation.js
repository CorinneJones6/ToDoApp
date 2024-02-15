const Validator = require('validator'); // Import the Validator library for data validation
const isEmpty = require('./isEmpty'); // Import the custom isEmpty function to check for empty values

// Function to validate the input data for user registration
const validateRegisterInput = (data) => {
    let errors = {}; // Initialize an object to collect validation errors

    // Validate the email field
    if(isEmpty(data.email)){
        errors.email = "Email field cannot be empty"; // Email cannot be empty
    }
    else if(!Validator.isEmail(data.email)){
        errors.email = "Email is invalid, please provide a valid email"; // Check if email is valid
    }

    // Validate the password field
    if(isEmpty(data.password)){
        errors.password = "Password field cannot be empty" // Password cannot be empty
    }
    else if(!Validator.isLength(data.password, {min: 6, max: 150})){
        errors.password = "Password must be between 6 and 150 characters long" // Password length check
    }

      // Validate the name field
     if(isEmpty(data.name)){
        errors.name = "Name field cannot be empty" // Name cannot be empty
    }
    else if(!Validator.isLength(data.name, {min: 2, max: 30})){
        errors.name = "Name must be between 2 and 30 characters long" // Name length check
    }

    // Validate the confirm password field
    if(isEmpty(data.confirmPassword)){
        errors.confirmPassword = "Confirm Password field cannot be empty"; // Confirm password cannot be empty
    }
    else if(!Validator.equals(data.password, data.confirmPassword)){
        errors.confirmPassword = "Password and Confirm Password fields must match" // Check if password and confirm password match
    }

    // Return the errors object and a boolean indicating if the input is valid
    return {
        errors, 
        isValid: isEmpty(errors),
    }
};

// Export the validateRegisterInput function for use in other parts of the application
module.exports = validateRegisterInput; 