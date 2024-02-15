// Define a function 'isEmpty' that checks if a given value is considered empty.
// The value is considered empty if it meets any of the following conditions:
// 1. It is undefined.
// 2. It is null.
// 3. It is an object with no own enumerable properties (i.e., an empty object).
// 4. It is a string that, after being trimmed of whitespace, has a length of 0 (i.e., an empty string).

const isEmpty = (value) =>
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length ===0)||
    (typeof value === "string" && value.trim().length ===0);

    module.exports = isEmpty; 