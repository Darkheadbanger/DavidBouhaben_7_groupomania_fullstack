/*const User = require("../models/user.model");
const dbConfig = require("../config/db.config.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const _ = require('lodash');

exports.signup = (req, res, next) => {
  bcryptjs.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      //...req.body,// pour tout récuperer
      email: req.body.email,
      password: hash, // pour hacher
    });
    User.sync({ force: true }).then(function () {
      //Table created
      return User.create(user);
    });
  });
};*/
