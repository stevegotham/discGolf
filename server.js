// requires and variables
var express    = require('express');
var bodyParser = require('body-parser');
var logger     = require('morgan');
var mongoose   = require('mongoose');
var routes     = require('./routes.js');
var bcrypt     = require('bcryptjs');
var app        = express();
var port       = process.env.PORT || 2323;
// -=-=-=-=-=-=-=-=-=
// configuration
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
mongoose.connect('mongodb://localhost/discGolfDB');
// -=-=-=-=-=-=-=-=-=
// routes
app.use('/', routes);
// -=-=-=-=-=-=-=-=-=
// start server
app.listen(port, function(){
  console.log('Server listening on port ' + port);
});
// -=-=-=-=-=-=-=-=-=
