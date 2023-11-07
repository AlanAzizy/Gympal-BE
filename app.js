// ! REQUIERE
// nyobain
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoutes");
const authMiddlewares = require("./middlewares/authMiddlewares");
const socialRoutes = require("./routes/socialRoutes");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/dashboard');
const User = require("./models/User");

var app = express();

// ! view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//! MIDDLEWARE SETUP
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ! DATABASE CONNECTION
const DbURI = "mongodb+srv://mrpdzikri:150403Database@cluster0.bkbukuu.mongodb.net/firstProject"
const options = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(DbURI, options)
  .then((result) => {
    app.listen(3000, () => {
      console.log("listening on port 3000...");
    })
  })
  .catch((err) => console.log(err));


//! ROUTE
app.use(authMiddlewares.authCheck);
app.use('/', indexRouter);
app.use('/dashboard', authMiddlewares.protectRoute, usersRouter);
app.use('/social', authMiddlewares.protectRoute, socialRoutes);
app.use("/auth", authRoute);



// !GLOBAL ERROR HANDLER
app.use(function (req, res, next) {
  next(createError(404));
});
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;