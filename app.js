const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const bodyParser = require("body-parser");
const passport = require("passport");
//const users = require("./routes/api/users");
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const multer = require('multer');
const flash = require('connect-flash');

app.use(express.json());
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

app.use(cookieParser());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// View Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.locals.basedir = app.get('views');

//Handle file uploads
//app.use(multer({dest:'./uploads'}));


// Routes
require('./starter/routes')(app);
//app.use("/api/users", users);
// require('./startup/config')();

const port = process.env.PORT || 10000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;