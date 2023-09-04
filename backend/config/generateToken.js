const jwt = require('jsonwebtoken')
const generateToken = (email)  =>{  //here it is taking email and encrypting it into a token and returning it back to where this is called
const salt = "this is my salt"

const token = jwt.sign({email}, salt)

return token;


}

module.exports = generateToken