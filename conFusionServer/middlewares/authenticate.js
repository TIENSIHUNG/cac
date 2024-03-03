var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("../models/users");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
var config = require("../config/config");
var ip = require("ip");

exports.getToken = function (user) {
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT payload: ", jwt_payload);
    User.findOne({ _id: jwt_payload._id })
      .then((user) => {
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch((err) => {
        console.error("JWT verification error:", err);
        return done(err, false);
      });
  })
);

exports.verifyUser = function (req, res, next) {
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, config.secretKey, function (err, decoded) {
      if (err) {
        var err = new Error("You are not authenticated!");
        err.status = 401;
        return next(err);
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    var err = new Error("No token provided!");
    err.status = 403;
    return next(err);
  }
};

exports.verifyIP = function (req, res, next) {
  const clientIp = req.ip;
  const allowedIps = config.allowedIPs; // Configure allowed IP addresses in your config file

  if (allowedIps.includes(clientIp)) {
    next(); // IP is allowed, proceed to the next middleware
  } else {
    const err = new Error("Access denied! Your IP is not allowed.");
    err.status = 403;
    return next(err);
  }
};

// Middleware to combine IP and token verification
exports.verifyUserOrIP = function (req, res, next) {
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  const clientIp = req.ip;
  const allowedIps = config.allowedIPs; // Configure allowed IP addresses in your config file

  if (token) {
    jwt.verify(token, config.secretKey, function (err, decoded) {
      if (err) {
        // Token verification failed, check IP
        if (allowedIps.includes(clientIp)) {
          next(); // IP is allowed, proceed to the next middleware
        } else {
          const err = new Error("Access denied! Your IP is not allowed.");
          err.status = 403;
          return next(err);
        }
      } else {
        // Token verification successful
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // No token provided, check IP
    if (allowedIps.includes(clientIp)) {
      next(); // IP is allowed, proceed to the next middleware
    } else {
      const err = new Error("Access denied! Your IP is not allowed.");
      err.status = 403;
      return next(err);
    }
  }
};
