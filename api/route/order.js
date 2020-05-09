const express = require("express");
const router = express.Router()
const mongoose = require('mongoose');

const Order = require('./models/order');
const Product = require('./models/products');

//handle order request
router.get('/', (req, res, next) => {
    Order.find()
        .select('product _id quantity')
        .populate('product','name ' )
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                order: docs.map(doc => {
                    return {
                        _id: doc.id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/order/' + doc._id
                        }
                    }

                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    let body = req.body
    Product.findById(req.body.productId)
        .then(product => {
            // check if product exists
            console.log(product)
            if (!product)
                throw new Error("product doesnt exits");

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: body.quantity,
                product: body.productId
            });

            order
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: "Order saved",
                        createdOrder: {
                            _id: result._id,
                            product: result.product,
                            quantity: result.quantity
                        },
                        request: {
                            type: 'GET',
                            url: 'http//localhost:3000/order/' + result._id
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err.message
                    });
                });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err.message
            });
        });
})

router.delete('/:orderId', (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {

            res.status(200).json({
                message: 'order deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/order',
                    body: { productId: "ID", quantity: "Number" }
                }
            });

        })
        //catch
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err.message
            });

        })
})

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product')
        .exec()
        .then(order => {
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/order'
                }
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router; 