const mongoose = require('mongoose');

const productSchema = mongoose.Schema({ 
    name: {
        type: String,
        require: true,
        trim: true,
    },
    description:{
        type:String,
        require:true,
        trim:true,
    },
    quantity:{
        type:Number,
        require:true,
        trim:true,
    },   
    images:[{
        type:String,
        require:true,
    }],
    category:{
        type:String,
        require:true,
        trim:true,
    },
    price:{
        type:Number,
        require:true,
        trim:true,
    },   
});


const Product = mongoose.model("Product",productSchema);
module.exports = {Product,productSchema};
