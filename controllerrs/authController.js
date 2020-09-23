const JWT_SECRET = 'smsGateWayChilltalk.tld';
const jwt = require('jsonwebtoken'); 
require('dotenv').config()

let tokenKey ;

module.exports.JWT_SECRET = JWT_SECRET ;

exports.ensureToken = (req, res, next) => {
    //console.log("auth ")
    //console.log(process.env.JWT_SECRET)
    const token = req.headers["authorization"]
    console.log(token);
    console.log(process.env.API_KEY_SECRET)
    if(typeof token !== 'undefined')
    {     
        req.token = token ;
        tokenKey = token ;
        // jwt.sign({user : "xxx"},process.env.API_KEY_SECRET ,(err, token)=>{
        //     //console.log(token)
        // })
        jwt.verify( tokenKey ,process.env.API_KEY_SECRET, function(err ,data){
            if(err){
                //console.log("err 2")
                res.status(403).end();
            }
            else 
            {
                //console.log("auth 2")
                next();
            }
        })
    }
    else{
        //console.log("err 1")
        res.status(403).end();
    }
    
}