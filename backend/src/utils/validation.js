const validator = require("validator");
const validateSignUpData = (req) => {
  const { emailId, password, firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid ");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid ");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not valid");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "skills",
    "photoUrl",
  ];
  const isEditAllowed=Object.keys(req.body).every(key=>allowedEditFields.includes(key))
  return isEditAllowed;
};
module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
