var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const mongoose = require("mongoose");
var connectionUri = require('./utilities/connection');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var coinsRouter = require('./routes/coins');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/coins', coinsRouter);
app.use('/api/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
const uri = connectionUri.uri;
const params = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(uri, params);
app.listen(3006, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", 3006);
});
module.exports = app;
