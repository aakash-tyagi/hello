const express = require("express");
const router = express.Router()
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');



router.post("/signup", (req, res, next) => {
    let body = req.body;
    User.find({ email: body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exist'
                });

            } else {
                bcrypt.hash(body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                result.password = undefined
                                res.status(201).json({
                                    result
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err.message

                                });
                            });
                    }
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err.message

            });
        })

});

router.post('/login', (req, res, next) => {
    let body = req.body;
    User.find({ email: body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            bcrypt.compare(body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth FAiled'
                    });
                }
                if (result) {
                    return res.status(200).json({
                        message: 'auth succesful'
                    });
                }
                return res.status(401).json({
                    message: 'Auth FAiled'
                });
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

    });



    router.delete("/:userId", (req, res, next) => {
        User.remove({ _id: req.params.id })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'User deleted'
                });

            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }
    );
    module.exports = router; 