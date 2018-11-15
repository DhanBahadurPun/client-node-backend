const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
// Load User Model
const User = require("../../models/User");
const config = require("../../config/index");

// Load input Validation
const ValidateRegisterInput = require("../../validation/register");
const ValidateLoginInput = require("../../validation/login");

// @route GET api/users/test
// @desc Test users route
// @access Public

router.get("/test", (req, res, next) => res.json({ message: "User Works" }));

/* @route GET api/users/register
@desc register user
@access Public */
router.post("/register", (req, res) => {
  const { errors, isValid } = ValidateRegisterInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", //rating
        d: "mm" // default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          // if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//  @route GET api/users/login
// @desc login user / returning jwt token
// @access Public

router.post("/login", (req, res) => {
  const { errors, isValid } = ValidateLoginInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then(user => {
    // check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(400).json(errors);
    }
    // check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // user match
        // const payload = { id: user._id, name: user.name, avatar: user.avatar }; // create jwt payload

        jwt.sign(
          { id: user._id, name: user.name, avatar: user.avatar },
          config.jwtSecret,
          { expiresIn: 360000},
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

/* @route GET api/users/current
@desc current user
@access Private */
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.email,
      email: req.user.email
    });
  }
);

module.exports = router;
