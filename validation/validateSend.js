// validate send form
const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateSend(data) {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.to = !isEmpty(data.to) ? data.to : "";
    data.subject = !isEmpty(data.subject) ? data.subject : "";
    data.message = !isEmpty(data.message) ? data.message : "";
    data.size = !isEmpty(data.size) ? data.size : "";

    // Email checks
    if (Validator.isEmpty(data.to)) {
        errors.to = "Email field is required";
    } else if (!Validator.isEmail(data.to)) {
        errors.to = "Email is invalid";
    }

    // Subject checks
    if (Validator.isEmpty(data.subject)) {
        errors.subject = "Subject field is required";
    }

    // Message checks
    if (Validator.isEmpty(data.message)) {
        errors.message = "Message field is required";
    }

    // Size checks
    if (Validator.isEmpty(data.size)) {
        errors.size = "Size field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}