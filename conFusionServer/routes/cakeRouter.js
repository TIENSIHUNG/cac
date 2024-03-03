const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Cakes = require('../models/cakes');

const CakesRouter = express.Router();

CakesRouter.use(bodyParser.json());

CakesRouter.route('/')
.get((req, res, next) => {
  Cakes.find({})
    .then((Cakess) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(Cakess);
    })
    .catch((err) => next(err));
}).post((req, res, next) => {
    Cakes.create(req.body).then((Cakes) => {
        console.log('Cakes Created',Cakes);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Cakes);
    },(err)=> next(err)).catch((err)=> next(err));
}).put((req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /Cakess');
}).delete((req,res,next)=>{
    Cakes.deleteOne({}).then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err)=>next(err)).catch((err)=> next(err));
});

CakesRouter.route('/:cakeId')
.get((req, res, next) => {
  Cakes.findById(req.params.cakeId)
    .then((cakes) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(cakes);
    })
    .catch((err) => next(err));
}).post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /Cakess/${req.params.cakeId}`);
}).put((req,res,next)=>{
    Cakes.findByIdAndUpdate(req.params.cakeId, {
      $set: req.body
    }, { new: true })
    .then((Cakes) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(Cakes);
    })
    .catch((err) => next(err));
}).delete((req,res,next)=>{
    Cakes.findByIdAndDelete(req.params.CakesId)
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err)=>next(err)).catch((err)=> next(err));
});


module.exports = CakesRouter;
