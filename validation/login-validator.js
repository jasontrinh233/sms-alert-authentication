const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
   let errors = {};

   // Convert empty html field to empty string-type to use in Validator.isEmpty()
   data.email = !isEmpty(data.email) ? data.email : "";
   data.password = !isEmpty(data.password) ? data.password : "";

   // Validate email
   if (Validator.isEmpty(data.email)) {
      errors.email = "Email field is required";
   }

   // Validate password
   if (Validator.isEmpty(data.password)) {
      errors.password = "Password field is required";
   }

   return {
      errors,
      isValid: isEmpty(errors)
   };
};
