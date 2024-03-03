const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Topping = require('../models/toppings');

const toppingRouter = express.Router();

toppingRouter.use(bodyParser.json());

toppingRouter.route('/')
.get((req, res, next) => {
    Topping.find({})
    .then((Topping) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Topping);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Topping.create(req.body)
    .then((topping) => {
        console.log('topping Created ', topping);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(topping);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Topping');
})
.delete((req, res, next) => {
    Topping.deleteOne({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

toppingRouter.route('/:toppingId')
.get((req, res, next) => {
    Topping.findById(req.params.toppingId)
    .then((topping) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(topping);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /Topping/'+ req.params.toppingId);
})
.put((req, res, next) => {
    Topping.findByIdAndUpdate(req.params.toppingId, {
        $set: req.body
    }, { new: true })
    .then((topping) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(topping);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Topping.findByIdAndDelete(req.params.toppingId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = toppingRouter;
