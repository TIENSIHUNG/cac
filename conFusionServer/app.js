var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var passport = require("passport");

var authenticate = require("./middlewares/authenticate");
var config = require('./config/config');

var dishRouter = require("./routes/dishRouter.js");
var promoteRouter = require("./routes/promoteRouter.js");
var leaderRouter = require("./routes/leaderRouter.js");
var cakeRouter = require("./routes/cakeRouter.js");
var toppingRouter = require("./routes/toppingRouter.js");
var userRouter = require("./routes/userRouter.js");

var app = express();
const url = config.mongoUrl;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Dishes = require("./models/dishes");
const Promotions = require("./models/promotions");
const connect = mongoose.connect(url);
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/users'); // Assuming you have a User model

connect.then(
  (db) => {
    console.log("Connected correctly to Server");
  },
  (err) => {
    console.log(err);
  }
);

app.use(
  session({
    name: "session-id",
    secret: "12345-67890-09876-54321",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // Assuming you're using Passport-Local Mongoose

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Logging middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes with authentication middleware
app.use("/dishes", dishRouter);
app.use("/promotions", promoteRouter);
app.use("/leaders", leaderRouter);
app.use("/cakes", cakeRouter);
app.use("/toppings", toppingRouter);
app.use("/users", userRouter);

app.set("view engine", "ejs");

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Send error as JSON
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      stack: req.app.get("env") === "development" ? err.stack : "",
    },
  });
});

module.exports = app;
