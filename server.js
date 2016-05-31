// start requires and variables
var express    = require('express');
var bodyParser = require('body-parser');
var logger     = require('morgan');
var mongoose   = require('mongoose');
var routes     = require('./routes.js');
var bcrypt     = require('bcryptjs');
var app        = express();

 // end requires and variables
// -=-=-=-=-=-=-=-=-=
// start configuration
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
mongoose.connect('mongodb://localhost/discGolfDB');

// end configuration
// -=-=-=-=-=-=-=-=-=
// start middleware

// end middleware
// -=-=-=-=-=-=-=-=-=
// start routes
app.use('/', routes)
// end routes
// -=-=-=-=-=-=-=-=-=
// start server
app.listen(2323, function(){
  console.log('Server listening on port 2323');
});
// end server
// -=-=-=-=-=-=-=-=-=
