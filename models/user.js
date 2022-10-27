const mongoose = require('mongoose');
const {productSchema} = require('../models/product');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
    },
    email: {
        required: true,
        trim: true,
        type: String,
        validate: {
            validator: (value) => {
                const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return value.match(re)    ;
            },
            message: "Please enter a valid email address"
        }
    },
    password: {
        required: true,
        type: String,
        validate: {
            validator:(value)=>{
                return value.length > 6;
            },
            message: "Please enter longer password "
        }
    },
    address: {
        type: String,
        default: '101 Lake, Wall Street'
    },
    type: {
        type: String,
        default: 'user',
    },
    cart: [
        {
            product:productSchema,
            quantity: {
                type:Number,
            }
        }
    ]
});

const User = mongoose.model("User",userSchema);
module.exports = User;