const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
   let errors = {};

   // Convert empty html field to empty string-type to use in Validator.isEmpty()
   data.email1 = !isEmpty(data.email1) ? data.email1 : "";
   data.password1 = !isEmpty(data.password1) ? data.password1 : "";
   data.email2 = !isEmpty(data.email2) ? data.email2 : "";
   data.password2 = !isEmpty(data.password2) ? data.password2 : "";
   data.phone = !isEmpty(data.phone) ? data.phone : "";

   // Validate email1
   if (Validator.isEmpty(data.email1)) {
      errors.email1 = "Email field is required";
   } else if (!Validator.isEmail(data.email1)) {
      errors.email1 = "Email is invalid";
   }

   // Validate email2
   if (data.email2 != data.email1) {
      errors.email2 = "Confirming email does not match";
   }

   // Validate password1
   if (Validator.isEmpty(data.password1)) {
      errors.password1 = "Password field is required";
   } else if (!Validator.isLength(data.password1, { min: 5, max: undefined })) {
      errors.password1 = "Password must be longer than 5 characters";
   }

   // Validate password2
   if (data.password2 != data.password1) {
      errors.password2 = "Confirming password does not match";
   }

   // Validated phone
   if (Validator.isEmpty(data.phone)) {
      errors.phone = "Phone field is required";
   } else if (!Validator.isMobilePhone(data.phone)) {
      errors.phone = "Phone number is invalid";
   }

   return {
      errors,
      isValid: isEmpty(errors)
   };
};
