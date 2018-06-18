// get all the tools we need
const express = require("express");
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const locales = require('./data/locales');

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const configDB = require("./config/db.js");

const i18n = require("i18n");

var app = express();

mongoose.connect(
  configDB.url,
  () => console.log("MongoDB: connect successful")
);

require("./app/models/user");
require("./app/models/post");

app.use(express.static(__dirname + "/public"));

locales.forEach((lang) => {
  app.use(`/${lang}`, express.static(__dirname + "/public"));
});

i18n.configure({
  locales,
  directory: __dirname + "/locales",
  cookie: 'localization'
});

app.use(morgan("dev"));
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");

// app.enable('view cache');

app.use(i18n.init);

app.use(
  session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret: "keyboard cat",
    saveUninitialized: false,
    resave: true,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.locals.locales = locales;

require("./app/routes.js")(app, passport);
require("./config/passport")(passport);

app.listen(port);
console.log("Port: " + port);
