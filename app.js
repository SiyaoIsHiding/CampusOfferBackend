var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var mysql = require('mysql');
//var fs = require('fs')

const PORT = process.env.PORT || 80;

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();
/*
var conn = mysql.createConnection({host:"janedatabase.mysql.database.azure.com", 
user:"CampusOfferAdmin", 
password:"DannyJaneSoniaStella2023", 
database:"JANEDB", 
port:3306, ssl:{ca:fs.readFileSync("DigiCertGlobalRootCA.crt.pem")}});
*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);

module.exports = app;
/*
conn.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  sql = "SELECT * FROM products"
  conn.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result[0]);
  });
});
*/
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type,Accept");
  next();
});

/*
* error handling
*/
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

app.listen(PORT,(err) => {
  if(err) {
    throw err;
  }
  console.log(`Server running and listening on port ${PORT}`)
});

