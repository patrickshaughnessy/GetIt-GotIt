/*jshint node:true*/
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compress = require('compression');
var cors = require('cors');

var favicon = require('serve-favicon');
var logger = require('morgan');
var port = process.env.PORT || 3000;
var path = require('path');

var environment = process.env.NODE_ENV;

app.use(favicon(path.resolve(__dirname, 'assets/greencircle.ico')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(compress());
app.use(logger('dev'));
app.use(cors());
// app.use(errorHandler.init);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

app.get('/ping', function(req, res, next) {
  console.log(req.body);
  res.send('pong');
});

app.use('/health', require('./routes/health'));
app.use('/docker', require('./routes/docker'));

switch (environment) {
  case 'production':
  console.log('** PRODUCTION **');
  app.use(express.static('./dist/'));
  app.use('/*', express.static('./dist/index.html'));
  break;
  default:
  console.log('** DEV **');
  app.use(express.static('./src/client/'));
  app.use(express.static('./'));
  app.use(express.static('./tmp'));
  app.use('/*', express.static('./src/client/index.html'));
  break;
}


app.listen(port, function() {
  console.log('Express server listening on port ' + port);
  console.log('env = ' + app.get('env') +
  '\n__dirname = ' + __dirname +
  '\nprocess.cwd = ' + process.cwd());
});

module.exports = app;
