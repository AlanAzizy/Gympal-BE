// ! REQUIERE
//Hahahaha
// nyobain
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
var cors = require('cors');

const Pengguna = require("./models/Pengguna");


var app = express();
app.use(cors());

// ! view engine setup
app.set('views', path.join(__dirname, 'views'));

//! MIDDLEWARE SETUP
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ! DATABASE CONNECTION
const DbURI = "mongodb+srv://GymPal:Gwencana@cluster0.yimmfp3.mongodb.net/GymBal"
const options = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(DbURI, options)
  .then((result) => {
    app.listen(3001, () => {
      console.log("listening on port 3001...");
    })
  })
  .catch((err) => console.log(err));


// ! ROUTES
app.get("/", (req, res) => {
  res.json({ pesan: "halo" });
})

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