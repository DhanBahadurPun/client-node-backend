const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const expressValidator = require("express-validator");
const cors = require("cors");

const app = express();

const config = require("./config/index");
require("./database");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cors());
// Middleware function
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

app.use(function(req, res, next) {
  const err = {
    status: 404,
    message: "Not Found"
  };
  next(err);
});

app.use(function(err, req, res, next) {
  const status = err.status || 400;
  res.status(400).json({
    message: err.message || err
  });
});

app.listen(config.app.port, function(err, done) {
  if (err) {
    console.log("error is " + err);
  } else {
    console.log("server listening at port " + config.app.port);
  }
});
