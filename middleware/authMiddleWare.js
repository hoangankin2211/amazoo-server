const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleWare = async  (req,res,next) => {
    try {
        const token = req.header("token");
        if (!token){
            return res.status(401).json({ msg: "No auth token, access denied" });
        }
        
        const verified = jwt.verify(token, "passwordKey");
        
        if (!verified)
          return res
            .status(400)
            .json({ msg: "Token verification failed, authorization denied." });
        
        req.user = verified.id;
        req.token = token;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error:error.message});
    }
}

module.exports = authMiddleWare;