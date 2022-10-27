const { json } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const getProduct = async (req,res,next) => {
    try {
        const token = req.header("token");
        if(!token){
            return res.status(401).json({msg:"No auth token, access deny"});
        }

        const verified = jwt.verify(token,'passwordKey')
        if (!verified){
            return res.status(401).json({msg:"Token verification failed, authorization denied." });
        }
        
        const user = await User.findById(verified.id);
        if (user.type == "user") {
            return res.status(400).json({ msg: "You are not an admin!" });
        }

        req.user = verified.id;
        req.token = token;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
};


module.exports = getProduct

