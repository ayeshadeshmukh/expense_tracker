const jwt = require('jsonwebtoken')

const protect = (req,res,next) =>{
   console.log("We are in protect middleware")
   console.log("The token is ",req.headers.token);
if(!req.headers.token){
    req.myemail = " ";
    next();
}
 else{
    console.log("The headers in protect middleware is ",req.headers)
   const { token } = req.headers;
   const decoded = jwt.verify(token, "this is my salt");
   req.myemail = decoded.email;
   next();
 }

}

module.exports = protect
