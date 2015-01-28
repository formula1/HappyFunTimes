
"use strict";

//These are the npm modules your allowing to be browserified
//Important as you don't want to allow everything
var makepublic = ["semver"];
var creepingBackwards = /.*\/\.\.?\/.*/;
var doubleSlash = /.*\/\/.*/;
var jsEnd = /.*\.js$/;

var browserify = require('browserify');
var url = require("url");
module.exports = function(req,res,next){
  var path = url.parse(req.originalUrl).pathname;
  //will be 404
  if(creepingBackwards.test(path)){
     return next();
  }
  //will be 404
  if(doubleSlash.test(path)){
    return next();
  }
  path = path.split("/");
  //will be 404
  if(path.length > 3){
    return next();
  }
  path = path[2];
  if(jsEnd.test(path)){
    path = path.substring(0,path.length-3);
  }
  if(makepublic.length && makepublic.indexOf(path) === -1){
    return next();
  }
  res.setHeader('content-type', 'application/javascript');
  var b = browserify(path).bundle();
  b.on('error', next); //Edit this to specify a specific 500 error code
  b.pipe(res);
};
