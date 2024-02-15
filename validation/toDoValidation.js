const Validator = require('validator'); // Import Validator library for string validations
const isEmpty = require('./isEmpty'); // Import custom isEmpty function to check for empty values

// Function to validate todo input
const validateToDoInput = data => {
    let errors = {}; // Initialize an object to collect validation errors

    // Check content field
    if(isEmpty(data.content)){ // Check if the content field is empty using the custom isEmpty function
        errors.content = "Content field cannot be empty"; // If empty, add error message for content field
    
    } else if (!Validator.isLength(data.content, { min: 1, max: 300 })) { // Check if content length is within 1 to 300 characters
        errors.content = 'Content field must be between 1 and 300 characters'; // If not, add error message for content length
    }

    // Return the errors object and a boolean indicating if the input is valid
    return{
        errors: errors,
        isValid: isEmpty(errors)
    }; 
}; 

module.exports = validateToDoInput; 
