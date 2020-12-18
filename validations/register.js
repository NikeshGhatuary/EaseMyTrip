const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};// Convert empty fields to an empty string so we can use validator functions
  //data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirm_password = !isEmpty(data.confirm_password) ? data.confirm_password : "";// Name checks
  /*if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }*/
  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }if (Validator.isEmpty(data.confirm_password)) {
    errors.confirm_password = "Confirm password field is required";
  }if (!Validator.isLength(data.password, { min: 8, max: 255 })) {
    errors.password = "Password must be at least 8 characters";
  }if (!Validator.equals(data.password, data.confirm_password)) {
    errors.confirm_password = "Passwords must match";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};