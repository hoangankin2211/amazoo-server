const express = require("express");
const productRouter = express.Router();

const {Product} = require('../models/product');
const authMiddleWare = require("../middleware/authMiddleWare");
const { query } = require("express");

///api/product?category=mobiles
productRouter.get('/api/product', authMiddleWare, async (req, res) => {
    console.log(req, query.category);
    let product = await Product.find({ category: req.query.category });
    if (!product) {
        res.status(400).json({ msg: "Do not exist product corresponding with category" });
    }

    console.log(product)

    res.json(product);
});

productRouter.get('/api/product/search/:name',authMiddleWare,async (req,res) => {
    try {
        console.log('here');
        const products = await Product.find({
            name : req.params.name
        });

        res.json(products);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error:error.message});
    }

});

productRouter.get("/api/product/deal-of-the-day",authMiddleWare, async (req,res) => {
    try {
        let products = await Product.find({});

        res.json(products[0]);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

module.exports = productRouter;