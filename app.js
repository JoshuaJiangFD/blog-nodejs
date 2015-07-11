var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var cookieParser = require('cookie-parser');
var session=require('express-session');/*session middleware for express*/
var redisStore=require('connect-redis')(session);/*use redis to store the session data*/

var bodyParser = require('body-parser');

var routes = require('./routes/index');
var userRoute = require('./routes/users');


var userLoad = require('./services/lib/user');
var settings=require('./settings');

var app = express();

// view engine setup
if (app.get('env') === 'development')
  app.set('views', path.join(__dirname, 'views'));
else
  app.set('views', path.join(__dirname, 'dist/views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));

/**
 * body-parser middleware:
 *  exposes various factories to create concrete middlewares to parse different request body contents, like json, buffer, plain text, url encoded.
 *  all these concrete middlewares produces req.body property.
 *
 *  when posting forms,there are two types of request body encoding: URL-encoded and multipart(json, buffer, text,file...).
 *  all the encoding types are specified in the request's "content-type" field.
 *  @see <a href="https://github.com/expressjs/body-parser"/>
 */
app.use(bodyParser.json());/*parse json encoded body and set req.body as json object*/
app.use(bodyParser.urlencoded({ extended: false }));/*false stands for parsing the URL-encoded data with "querystring" library.*/

/**
 *cookie-parser middleware:
 *  take care of parsing the request cookies, setting the cookies property on the request body: req.cookies.
 *
 *The server can send one or more of these cookies in the response of any request by using "Set-Cookie" response headers.
 *The Web browser has to store each of them and send them along as a single "Cookie" header on the following requests until the cookie expires.
 *every cookie has name, value,path,domain,secure,maxAge fields.
 */
/*passing secret string to create signed cookie for preventing client from modifying the cookie vaue*/
app.use(cookieParser());//settings.secrets.cookieSecret)

/**
  static file folder
 */
if (app.get('env') === 'development')
  app.use(express.static(path.join(__dirname, 'public')));
else
  app.use(express.static(path.join(__dirname, 'dist/static')));

/**
 *session middleware:
 * required to be after the cookie-parser due to it maintains the session using cookies.
 * required to be before the router. so that router has session data.
 *
 * session data is not saved in the cookie itself, just the session ID(by key:'app.sessid').
 * Session data is stored server-side.
 */
app.use(session({
  key:'app.sessid',/*name of the cookie, Defaults to connect.sid*/
  secret:settings.secrets.sessionSecret,
  maxAge:1000*60*60*24*30,/*session will live in server side for one month*/
  store:new redisStore(settings.sessionStoreConfig)/*use redis to store the session data*/
}));

/**
 * load user if req.session.uid exists.
 */
app.use(userLoad);

/**
 * loading the route.
 */
app.use('/', routes);
app.use('/users', userRoute);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


/**
 * error handling middleware
 *  --should be loaded after the loading the routes
 */
/* development error handler,will print stacktrace
    --make sure to put it before the production error handler.
*/
if (app.get('env') === 'development') {/*or process.env.NODE_ENV*/
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

/*
 production error handler,no stacktraces leaked to user
*/
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
