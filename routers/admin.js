const express = require('express');
const adminRouter = express.Router();
const admin = require('../middleware/admin');
const {Product} = require('../models/product');

adminRouter.post("/admin/addProduct", admin, async (req,res) => {
    try {
        const { name, description, quantity, images, category, price } = req.body
        let product = new Product({ name, description, quantity, images, category, price});
        product = await product.save();
        console.log(product.id)
        res.json(product);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message });
    }
});

adminRouter.get('/admin/getProduct',admin,async (req,res) => {
    try {   
        const {name} = req.header
        const product = Product.find({name})
        
        if (!product){
            res.json({isExisting: false,product:null})
        }

        res.json({isExisting:true,product:product})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
})

adminRouter.get('/admin/fetchAllProductData',admin,async (req,res) => {
    try {
        
        const product = await Product.find({});
        res.json(product);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error:error.message})
    }
})

adminRouter.post('/admin/deleteProduct',admin,async (req,res) => {
    try {
        
        const {id} = req.body;

        console.log(id);
        
        let product = await Product.findByIdAndDelete(id);
        let productTemp = await Product.findById(id)
        if (productTemp == null){
            res.json({isSuccess:false,product});
        }
        else {
            res.json({isSuccess:true,product});
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error:error.message});
    }
});

module.exports = adminRouter;