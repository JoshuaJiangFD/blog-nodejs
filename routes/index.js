var express = require('express');
var questions=require('../models/Questions');
var results=require('../models/Results');
var url = require( "url" );
var queryString = require( "querystring" );

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}



var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var appfile=(process.env.NODE_ENV||'development')=='development'?"app.js":"app.min.js";
  res.render('index', { title: '找好啦！',questions:questions,appPath:appfile});
});

router.get('/quiz',function(req,res,next){
  // parses the request url
  var theUrl = url.parse( req.url );

  // gets the query part of the URL and parses it creating an object
  var queryObj = queryString.parse( theUrl.query );

  // queryObj will contain the data of the query as an object
  // and jsonData will be a property of it
  // so, using JSON.parse will parse the jsonData to create an object
  var obj = JSON.parse( queryObj.jsonData );

  // as the object is created, the live below will print "bar"
  console.log( obj);
  var finalAnswerItem=obj[obj.length-1];
  var finalQuestion=questions[finalAnswerItem.qid-1];
  var finalAnswer=finalQuestion.branches.find(function(ele,idx,array){return ele.title==finalAnswerItem.answer;});
  var conclusion =results.conclusions[finalAnswer.conclusion];
  res.json(conclusion);
});


module.exports = router;
