// -=-=-=-=-=-=-=- requires and variables -=-=-=-=-=-=-=-=-=-=-=-=-
var $http  = require('request');
var Course = require('../models/courseModel.js');
$http      = $http.defaults({jar: true});
// -=-=-=-=-=-=-=-=- the object/methods exported to routes.js -=-=-=-=-=-=
module.exports = {
// -=-=-=-=-=-=-=-=-=- search database for multiple courses -=-=-=-=-=-
  search: function(req,res) {
    var query = {}
    if(req.query.city) query.city = req.query.city;
    if(req.query.name) query.name = req.query.name;
    if(req.query.state) query.state = req.query.state;
    if(req.query.zipCode) query.zipCode = req.query.zipCode;
    Course.find(query, function(err, course) {
      if (err) res.json({error: err})
      res.json(course)
    })
  },
// -=-=-=-=-=-=-=-=-=- search database for single course, to be used in single course page -=-=-=-=-=-=-=-
  searchOne: function(req,res) {
    Course.findById(req.params.id, function(err, course) {
      if (err) res.json({error: err})
      res.json(course)
    })
  }
}
