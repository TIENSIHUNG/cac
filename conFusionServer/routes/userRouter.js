const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const userRouter = express.Router();
userRouter.use(bodyParser.json());

function getToken(user) {
  return jwt.sign({ id: user._id }, config.secretKey, { expiresIn: "1h" });
}

userRouter.post("/signup", (req, res, next) => {
  // Attempt to register a new user
  User.register(
    new User({ username: req.body.username, password: req.body.password }),
    req.body.password,
    (err, user) => {
      if (err) {
        // If an error occurs during registration, handle it
        return next(err);
      }
      // If registration is successful, authenticate the user
      passport.authenticate("local")(req, res, () => {
        // Generate a token for the authenticated user
        const token = getToken(user);
        // Send a success response with the token and a status message
        res.status(200).json({ success: true, token: token, status: "Registration Successful!" });
      });
    }
  );
});

userRouter.post("/login", passport.authenticate("local"), (req, res) => {
  // If the control reaches here, it means the user has been authenticated successfully
  const token = getToken(req.user);
  res.status(200).json({
    success: true,
    token: token,
    status: "You are successfully logged in!",
  });
});

userRouter.get("/logout", (req, res, next) => {
  // JWT tokens are stateless, so no need to handle session
  res.clearCookie("session-id");
  res.redirect("/");
});

module.exports = userRouter;