const express = require('express');
const authRouter = require('./routers/auth.js');
const mongoose = require('mongoose');
const adminRouter = require('./routers/admin.js');
const productRouter = require('./routers/product.js');
const userRouter = require('./routers/user');

const PORT = process.env.PORT || 3000;

const app = express();
const linkDataBase = 'mongodb+srv://hoangankin123:hoangankin123@cluster0.lb1vuxi.mongodb.net/?retryWrites=true&w=majority';


//middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

//Creating GET
app.get('/hello-world', (req, res) => {
    res.json({hi:'hello world'});
});
app.get('/',(req,res)=>{
    res.json({"name":"Own Page: Trương Huỳnh Đức Hoàng"});
});

//Connections to mongoose database
mongoose.connect(linkDataBase).then(()=>{
    console.log("connect successful");
}).catch(e=>{
    console.log(e);
});


///Listen to server to handle api
app.listen(PORT, "0.0.0.0", () => {
    console.log(`connected at port ${PORT}`);
});

 