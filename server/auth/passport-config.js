const User = require("../models/index");
require("dotenv").config();
const secret = process.env.SECRET;
const mongoose = require("mongoose");

const { Strategy, ExtractJwt } = require("passport-jwt");

//this sets how we handle tokens coming from the requests that come
// and also defines the key to be used when verifying the token.
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
};

module.exports = passport => {
  passport.use(
    new Strategy(opts, (payload, done) => {
      User.findById(payload.id)
        .then(user => {
          if (user) {
            return done(null, {
              id: user.id,
              name: user.name,
              email: user.email
            });
          }
          return done(null, false);
        })
        .catch(err => console.error(err));
    })
  );
};
