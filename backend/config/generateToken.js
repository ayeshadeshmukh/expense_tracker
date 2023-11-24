const jwt = require("jsonwebtoken");
const generateToken = (email) => {
  const salt = "this is my salt";

  const token = jwt.sign({ email }, salt);

  return token;
};

module.exports = generateToken;
