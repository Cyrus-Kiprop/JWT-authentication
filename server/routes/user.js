const router = require("express").Router();

const User = require("../models");
const bcrypt = require("bcryptjs");

require("dotenv").config();
const secret = process.env.SECRET;
//gives us access to our environment variables
//and sets the secret object.
const passport = require("passport");
const jwt = require("jsonwebtoken");

// some routes
router.post("/register", (req, res) => {
  User.findOne({ emailAddress: req.body.email }).then(user => {
    if (user) {
      let error = "Email Address Exists in Database.";
      return res.status(400).json(error);
    } else {
      const newUser = new User({
        name: req.body.name,
        userName: req.body.userName,
        emailAddress: req.body.email,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => res.status(400).json(err));
        });
      });
    }
  });
});

// login routes
router.post("/login", (req, res) => {
  const emailAddress = req.body.email;
  const password = req.body.password;
  User.findOne({ emailAddress }).then(user => {
    if (!user) {
      let errors = {};
      errors.email = "No Account Found";
      return res.status(404).json(errors);
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user._id,
          name: user.userName
        };
        jwt.sign(payload, secret, { expiresIn: 36000 }, (err, token) => {
          if (err)
            res.status(500).json({ error: "Error signing token", raw: err });

          res.json({
            success: true,
            token: `Bearer ${token}`
          });
        });
      } else {
        errors.password = "Password is incorrect";
        res.status(400).json(errors);
      }
    });
  });
});

router.get(
  "/homepage",
  //   passport.authenticate("jwt", { session: false }),
  (req, res) => res.send("This is our homepage")
);

module.exports = router;
