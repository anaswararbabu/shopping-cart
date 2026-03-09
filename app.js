var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars')
var fileUpload = require('express-fileupload')
var db = require('./configuration/connection');
var session = require('express-session');

db.connect((err)=>{
  if(err)
    console.log("Connection error"+err)
  else
  console.log("Database connected Successfully to port 27017");
  
});


var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
const { request } = require('http');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

const handlebars = hbs.create({
  extname:'hbs',
  defaultLayout:'layout',
  layoutsDir:__dirname+'/views/layout/',
  partialsDir:__dirname+'/views/partials/',

  runtimeOptions:{
    allowProtoPropertiesByDefault:true,
    allowProtoMethodsByDefault:true
  },

  helpers:{
    eq:function(a,b){
      return a===b;
    },

    shorten:function(text,length){
      if(text && text.length > length){
        return text.substring(0,length)+'...'
      }
      return text
    },
    inc:function(value){
    return parseInt(value)+1
  }

  }
})

app.engine('hbs', handlebars.engine)
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(session({secret:"Key",cookie:{maxAge:600000}}));

app.use('/', userRouter);
app.use('/admin', adminRouter);

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

module.exports = app;
