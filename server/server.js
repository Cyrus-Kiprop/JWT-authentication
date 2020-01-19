const express = require("express");

const cookieParser = require("cookie-parser");
const passport = require("passport");

// instantiate express
const app = express();

// Instantiating passport
app.use(passport.initialize());

require("./auth/passport-config")(passport);
//imports our configuration file which holds our verification callbacks and things like the secret for signing.

// debuging tools
const morgan = require("morgan");

// configuring morgan
app.use(morgan("tiny"));

// configure dotenv to be able to read files from the .env files
require("dotenv").config({ debug: process.env.DEBUG });

const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// configuring bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connection string to mongoAtlas database
const db = process.env.MONGO_URI;

//custom Middleware for logging the each request going to the API
// app.use((req, res, next) => {
//   if (req.body) log.info(req.body);
//   if (req.params) log.info(req.params);
//   if (req.query) log.info(req.query);
//   log.info(
//     `Received a ${req.method} request from ${req.ip} for                ${req.url}`
//   );
//   next();
// });

// configuring routes
app.use("/users", require("./routes/user.js"));

//registers our authentication routes with Express.

// create a connection to the database

// console.log(process.env.MONGO_URI);

mongoose
  .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected successfully to the database"))
  .catch(err => console.log(err.stack));

//   Creating a server listen port
app.listen(process.env.PORT || 3001, () =>
  console.log(`App running at port ${process.env.PORT}`)
);
