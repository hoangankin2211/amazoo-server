const express = require('express');
const { Product } = require('../models/product');
const User = require('../models/user');
const userRouter = express.Router();
const authMiddleWare = require('../middleware/authMiddleWare');
const Order = require('../models/order');
const { json } = require('express');

userRouter.get('/api/user/get-cart', authMiddleWare, async (req, res) => {
    const id = req.usee;
    const user = User.findById(id);

    if (!user) {
        res.status(400).json({ msg: 'Can not find user authentication' });
    }

    res.json(user.cart);
});

userRouter.post('/api/user/add-to-cart', authMiddleWare, async (req, res) => {
    const { idProduct } = req.body;

    const product = await Product.findById(idProduct);
    let user = await User.findById(req.user);

    if (!user) {
        console.log("!user");
        res.status(400).json({ msg: 'Can not find user authentication' })
    }

    if (!product) {
        console.log("!product");
        res.status(400).json({ msg: 'Can not find corresponding product !!!' })
    }

    ////////////////////////////////////////

    let responseQuantity = 0;

    if (user.cart.length == 0) {
        user.cart.push({ product, quantity: 1 });
        responseQuantity = 1;
    } else {
        let isExistedProductInCart = false;
        for (let i = 0; i < user.cart.length; i++) {
            if (user.cart[i].product._id == idProduct) {
                user.cart[i].quantity += 1;
                responseQuantity = user.cart[i].quantity;
                isExistedProductInCart = true;
                break;
            }
        }
        if (isExistedProductInCart == false) {
            user.cart.push({ product, quantity: 1 });
            responseQuantity = 1;
        }
    }

    user = await user.save();

    res.json({ product: product, quantity: responseQuantity });

});

userRouter.post('/api/user/delete-product-in-cart', authMiddleWare, async (req, res) => {

    const { idProduct } = req.body;

    const product = await Product.findById(idProduct);
    let user = await User.findById(req.user);

    if (!user) {
        res.status(400).json({ msg: 'Can not find user authentication' })
    }

    else if (!product) {
        res.status(400).json({ msg: 'Can not find corresponding product broooo!!!' })
    }
    else {
        let responseQuantity = 0;

        if (user.cart.length > 0) {
            let isExistedProductInCart = false;

            for (let i = 0; i < user.cart.length; i++) {
                isExistedProductInCart = true;
                if (user.cart[i].product._id == idProduct && user.cart[i].quantity > 0) {
                    user.cart[i].quantity = user.cart[i].quantity - 1;
                    if (user.cart[i].quantity == 0) {
                        user.cart = user.cart.filter(element => element._id != idProduct);
                    }
                    responseQuantity = user.cart[i].quantity;
                    break;
                }
            }

            if (isExistedProductInCart == false) {
                res.status(400).json({ msg: 'Can not find product in cart !!!' });
            } else {
                user = await user.save();
                res.json({ id: idProduct, quantity: responseQuantity });
            }
        }
        else {
            res.status(400).json({ msg: 'Don\'t have anything in cart ! Buy something bro  !!!' });
        }

    }
})

///Save user address
userRouter.post('/api/user/save-address', authMiddleWare, async (req, res) => {
    console.log('/api/user/save-address');
    const { address } = req.body;
    const idUser = req.user;

    let user = await User.findById(idUser);

    if (!user) {
        res.status(400).json({ msg: 'Can not find user data authentication' })
    }

    user.address = address;

    user = await user.save();
    res.json(address);
});

userRouter.post('/api/user/order', authMiddleWare, async (req, res) => {
    try {
        console.log('/api/user/order');

        const { totalPrice, address } = req.body;
        const userId = req.user;

        let user = await User.findById(userId);

        if (!user) {
            res.status(400).json({ msg: 'Can not find user data authentication' })
        }


        let products = [];

        for (let i = 0; i < user.cart.length; i++) {
            products.push({ product: user.cart[i].product, quantity: user.cart[i].quantity});
        }

        user.cart = [];
        await user.save();

        console.log(products);

        let order = new Order({
            products,
            totalPrice,
            address,
            userId,
            orderedAt: new Date().getTime(),
        });

        await order.save();
        res.json(order);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = userRouter;