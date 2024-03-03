const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Dishes = require("../models/dishes");
const authenticate = require("../middlewares/authenticate");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

//create read delete service
dishRouter
  .route("/")
  .get((req, res, next) => {
    Dishes.find({})
      .then((dishes) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dishes);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Dishes.create(req.body)
      .then(
        (dish) => {
          console.log("Dish Created", dish);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.deleteOne({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
dishRouter
  .route("/:dishId")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /dishes/" + req.params.dishId);
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findByIdAndUpdate(
      req.params.dishId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (dish) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findByIdAndDelete(req.params.dishId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      })
      .catch((err) => next(err));
  });
dishRouter
  .route("/:dishId/comments")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments);
          } else {
            err = new Error("Dish " + req.params.dishId + "not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            dish.comments.push(req.body);
            dish.save().then(
              () => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
              },
              (err) => next(err)
            );
          } else {
            err = new Error("Dish" + req.params.dishId + "not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "PUT operation not supported on /dishes/" +
        req.params.dishId +
        "/comments"
    );
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            for (var i = dish.comments.length - 1; i <= 0; i--) {
              dish.comments.id(dish.comments[i]._id).deleteOne();
            }
            dish.save().then(
              () => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
              },
              (err) => next(err)
            );
          } else {
            err = new Error("Dish" + req.params.dishId + "not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

dishRouter
  .route("/:dishId/comments/:commentId")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish && dish.comments.id(req.params.commentId)) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish.comments.id(req.params.commentId));
        } else if (!dish) {
          const err = new Error("Dish " + req.params.dishId + " not found");
          err.status = 404;
          return next(err);
        } else {
          const err = new Error(
            "Comment " + req.params.commentId + " not found"
          );
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /dishes/" +
        req.params.dishId +
        "/comments/" +
        req.params.commentId
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish && dish.comments.id(req.params.commentId)) {
          if (req.body.rating) {
            dish.comments.id(req.params.commentId).rating = req.body.rating;
          }
          if (req.body.comment) {
            dish.comments.id(req.params.commentId).comment = req.body.comment;
          }
          dish
            .save()
            .then((dish) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(dish);
            })
            .catch((err) => next(err));
        } else if (!dish) {
          const err = new Error("Dish " + req.params.dishId + " not found");
          err.status = 404;
          return next(err);
        } else {
          const err = new Error(
            "Comment " + req.params.commentId + " not found"
          );
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish && dish.comments.id(req.params.commentId)) {
          dish.comments.id(req.params.commentId).remove();
          dish
            .save()
            .then((dish) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(dish);
            })
            .catch((err) => next(err));
        } else if (!dish) {
          const err = new Error("Dish " + req.params.dishId + " not found");
          err.status = 404;
          return next(err);
        } else {
          const err = new Error(
            "Comment " + req.params.commentId + " not found"
          );
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

module.exports = dishRouter;
