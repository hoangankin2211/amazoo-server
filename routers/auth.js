
const express = require("express");

const jwt = require("jsonwebtoken");

const getUserData = require("../middleware/userData");

const User = require("../models/user");

const authRouter = express.Router();

//SignIn Route
authRouter.post('/api/signup', async (req, res) => {
   try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res
        .status(400)
        .json({ msg: "User with the same email is already existed" })
    }

    let user = new User({
        name,
        email,
        password,
    });

    user = await user.save();
    
    res.json(user);
   } catch (e) {
    res.status(500).json({error:e.message});
   }
});

//SignUp Route
authRouter.post('/api/signin',async (req,res)=>{
    try {
        
        const { email, password } = req.body;

        const user = await User.findOne({email});

        if (!user){
            return res.status(400).json({
                msg : "User of this email doesn't exist"
            });
        }

        isMatch = password == user.password;
        
        if (!isMatch){
            return res.status(400).json({msg:"Incorrect password"});
        }

        const token = jwt.sign({id:user.id},"passwordKey");

        res.json({token,...user._doc});
    } catch (error) {
        res.status(500).json({error:e.message});
    }
});

//Check token to sign in automatically
authRouter.post('/api/checkTokenValid', async (req,res)=>{
    try {
        const token = req.header("token");
        
        if (!token){
            res.json({isValid:false});
        }

        const verify = jwt.verify(token,"passwordKey");
        if (!verify) {
            
            res.json(false);
        }
        console.log("verify.id: "+verify.id);
        console.log(token);
        const user = await User.findById(verify.id);
        console.log(user.name);
        if (!user){
            res.json({isValid:false});
        }
        res.json({isValid:true,...user._doc,token});
    } catch (error) {
        res.status(500).json({error:e.message});
    }
});

authRouter.get('/get-user-data',getUserData,async(res,req)=>{
    const user = await User.findById(req.user);
    res.json({token:res.token,...user._doc});
}); 

module.exports = authRouter;