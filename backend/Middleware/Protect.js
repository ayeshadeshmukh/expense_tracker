const jwt = require('jsonwebtoken')

const protect = (req,res,next) =>{
   console.log("WE are in protect middleware")
   console.log(req.headers.token);
if(!req.headers.token){
    res.status(400).json({
        error : "Please login first"
    });
}
 else{
    console.log(req.headers)
   const { token } = req.headers;
   console.log(token)
   const decoded = jwt.verify(token, "this is my salt");
   console.log(decoded)
   req.myemail = decoded.email;
   next();
 }

}

module.exports = protect
