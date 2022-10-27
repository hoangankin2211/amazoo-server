const jwt = require('jsonwebtoken');

const getUserData = async (req,res,next)=>{
    try {
        const token = req.header("token");
        
        if (!token){
            return res.status(401).json({error:"No auth token, access denied"});
        }

        console.log(token);
        const verified = jwt.verify(token,"passwordKey");
        if (!verified){
            return res.status(401)
            .json({ msg: "Token verification failed, authorization denied." });
        }
        console.log(verified.id);

        req.user = verified.id;
        req.token = token;
        next();
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}
module.exports = getUserData;
