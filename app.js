const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");

// import routes
const loginRouter = require("./routes/api/login");
const registerRouter = require("./routes/api/register");
const indexRouter = require("./routes/api/index");
const logoutRouter = require("./routes/api/logout");

// create server
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// use express-session
app.use(
   session({
      key: "user_sid",
      secret: "radomstuff",
      resave: false,
      saveUninitialized: false,
      cookie: {
         expires: 600000
      }
   })
);

// check if user's cookie is still saved in browser
app.use((req, res, next) => {
   if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie("user_sid");
   }
   next();
});

// check for logged-in users
const sessionChecker = (req, res, next) => {
   if (req.session.user && req.cookies.user_sid) {
      res.redirect("/login");
   } else {
      next();
   }
};

// use routes
app.use("/login", sessionChecker, loginRouter);
app.use("/register", sessionChecker, registerRouter);
app.use("/index", indexRouter);
app.use("/logout", logoutRouter);

module.exports = app;
